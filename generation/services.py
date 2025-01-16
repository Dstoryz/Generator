import logging
from transformers import MarianMTModel, MarianTokenizer

logger = logging.getLogger(__name__)

class TranslationService:
    def __init__(self):
        self.model_name = 'Helsinki-NLP/opus-mt-ru-en'
        self.tokenizer = None
        self.model = None

    def load_model(self):
        try:
            if self.tokenizer is None:
                self.tokenizer = MarianTokenizer.from_pretrained(self.model_name)
            if self.model is None:
                self.model = MarianMTModel.from_pretrained(self.model_name)
        except Exception as e:
            logger.error(f"Error loading translation model: {e}")
            raise

    def translate(self, text: str) -> str:
        try:
            self.load_model()
            
            # Токенизация текста
            inputs = self.tokenizer(text, return_tensors="pt", padding=True)
            
            # Генерация перевода
            translated = self.model.generate(**inputs)
            
            # Декодирование результата
            translated_text = self.tokenizer.decode(translated[0], skip_special_tokens=True)[:-1]
            
            return translated_text
        except Exception as e:
            logger.error(f"Translation error: {e}")
            # В случае ошибки возвращаем оригинальный текст
            return text 