import torch
from diffusers import AutoPipelineForText2Image
from PIL import Image
import os
from datetime import datetime

# Конфигурация тестируемого параметра
TEST_CONFIG = {
    "parameter": "sampler",  # Параметр для тестирования
    "values": ["DPM++ 2M Karras", "Euler a", "UniPC"],  # Значения для теста
    "prompt": "A beautiful mountain landscape with a lake at sunset"  # Базовый промпт
}

# Базовые параметры генерации
BASE_PARAMS = {
    "prompt": TEST_CONFIG["prompt"],
    "negative_prompt": "",
    "num_inference_steps": 50,
    "guidance_scale": 7.5,
    "width": 768,
    "height": 768,
    'seed': 31
}

def setup_test_directory():
    """Создание директории для результатов тестов"""
    results_dir = "test_results"
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    test_dir = os.path.join(results_dir, timestamp)
    os.makedirs(test_dir, exist_ok=True)
    return test_dir

def load_model(model_name="stabilityai/stable-diffusion-2-1"):
    """Загрузка модели"""
    device = "cuda" if torch.cuda.is_available() else "cpu"
    print(f"Using device: {device}")
    
    pipeline = AutoPipelineForText2Image.from_pretrained(
        model_name,
        torch_dtype=torch.float16,
        variant="fp16",
        use_safetensors=True
    ).to(device)
    
    return pipeline

def generate_and_save(pipeline, params, filename, save_dir):
    """Генерация и сохранение результата"""
    print(f"\nGenerating with parameters:")
    for k, v in params.items():
        print(f"{k}: {v}")
    
    image = pipeline(**params).images[0]
    
    image_path = os.path.join(save_dir, f"{filename}.png")
    params_path = os.path.join(save_dir, f"{filename}.txt")
    
    image.save(image_path)
    with open(params_path, 'w', encoding='utf-8') as f:
        for k, v in params.items():
            f.write(f"{k}: {v}\n")
    
    print(f"Saved to {image_path}")
    return image

def run_parameter_test():
    """Запуск тестирования параметра"""
    test_dir = setup_test_directory()
    pipeline = load_model()
    
    parameter = TEST_CONFIG["parameter"]
    values = TEST_CONFIG["values"]
    
    print(f"Testing parameter: {parameter}")
    print(f"Values to test: {values}")
    print(f"Base prompt: {TEST_CONFIG['prompt']}")
    
    # Генерация для каждого значения параметра
    for value in values:
        try:
            test_params = BASE_PARAMS.copy()
            
            # Особая обработка для seed
            if parameter == "seed":
                test_params["generator"] = torch.Generator("cuda").manual_seed(value)
            else:
                test_params[parameter] = value
            
            filename = f"{parameter}_{value}"
            generate_and_save(pipeline, test_params, filename, test_dir)
            
        except Exception as e:
            print(f"Error testing {parameter}={value}: {str(e)}")

if __name__ == "__main__":
    run_parameter_test() 


    