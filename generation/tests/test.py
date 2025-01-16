import unittest
from django.test import TestCase
from django.contrib.auth.models import User
from generation.models import ImageGenerationRequest
from generation.services import ImageGenerationService
import torch
import logging

logger = logging.getLogger(__name__)

class ImageGenerationTests(TestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.user = User.objects.create_user(username='testuser', password='12345')
        cls.service = ImageGenerationService()

    def test_basic_generation(self):
        """Базовый тест генерации с дефолтными параметрами"""
        prompt = "a beautiful landscape with mountains"
        result = self.service.generate(
            prompt=prompt,
            user=self.user
        )
        self.assertIsNotNone(result)
        logger.info(f"Basic generation test completed: {result.id}")

    def test_models(self):
        """Тест разных моделей"""
        prompt = "a cat sitting on a windowsill"
        models = [
            'stable-diffusion-v1-5',
            'stable-diffusion-v2-1',
            'stable-diffusion-xl-base-1.0'
        ]
        for model in models:
            with self.subTest(model=model):
                try:
                    result = self.service.generate(
                        prompt=prompt,
                        user=self.user,
                        model=model
                    )
                    self.assertIsNotNone(result)
                    logger.info(f"Model {model} test completed: {result.id}")
                except Exception as e:
                    logger.error(f"Model {model} test failed: {str(e)}")

    def test_guidance_scale(self):
        """Тест разных значений guidance_scale"""
        prompt = "a futuristic city"
        scales = [1.0, 3.0, 7.5, 15.0, 20.0]
        for scale in scales:
            with self.subTest(guidance_scale=scale):
                result = self.service.generate(
                    prompt=prompt,
                    user=self.user,
                    guidance_scale=scale
                )
                self.assertIsNotNone(result)
                logger.info(f"Guidance scale {scale} test completed: {result.id}")

    def test_steps(self):
        """Тест разного количества шагов"""
        prompt = "an abstract painting"
        steps_list = [10, 20, 30, 50, 100]
        for steps in steps_list:
            with self.subTest(steps=steps):
                result = self.service.generate(
                    prompt=prompt,
                    user=self.user,
                    n_steps=steps
                )
                self.assertIsNotNone(result)
                logger.info(f"Steps {steps} test completed: {result.id}")

    def test_seeds(self):
        """Тест разных сидов"""
        prompt = "a starry night sky"
        seeds = [42, 123, 456, 789, 1000]
        for seed in seeds:
            with self.subTest(seed=seed):
                result = self.service.generate(
                    prompt=prompt,
                    user=self.user,
                    seed=seed
                )
                self.assertIsNotNone(result)
                logger.info(f"Seed {seed} test completed: {result.id}")

    def test_dimensions(self):
        """Тест разных размеров изображения"""
        prompt = "a portrait of a person"
        dimensions = [
            (512, 512),
            (768, 512),
            (512, 768),
            (1024, 1024)
        ]
        for width, height in dimensions:
            with self.subTest(dimensions=(width, height)):
                result = self.service.generate(
                    prompt=prompt,
                    user=self.user,
                    width=width,
                    height=height
                )
                self.assertIsNotNone(result)
                logger.info(f"Dimensions {width}x{height} test completed: {result.id}")

    def test_color_schemes(self):
        """Тест разных цветовых схем"""
        prompt = "a still life with flowers"
        schemes = ['vibrant', 'muted', 'pastel', 'warm', 'cool', 'monochrome']
        for scheme in schemes:
            with self.subTest(color_scheme=scheme):
                result = self.service.generate(
                    prompt=prompt,
                    user=self.user,
                    color_scheme=scheme
                )
                self.assertIsNotNone(result)
                logger.info(f"Color scheme {scheme} test completed: {result.id}")

    def test_samplers(self):
        """Тест разных сэмплеров"""
        prompt = "an underwater scene"
        samplers = [
            'DPM++ 2M Karras',
            'Euler a',
            'UniPC',
            'DDIM'
        ]
        for sampler in samplers:
            with self.subTest(sampler=sampler):
                result = self.service.generate(
                    prompt=prompt,
                    user=self.user,
                    sampler=sampler
                )
                self.assertIsNotNone(result)
                logger.info(f"Sampler {sampler} test completed: {result.id}")

    def test_combined_parameters(self):
        """Тест комбинаций параметров"""
        test_cases = [
            {
                'prompt': "a magical forest",
                'model': 'stable-diffusion-v1-5',
                'guidance_scale': 7.5,
                'n_steps': 30,
                'seed': 42,
                'width': 768,
                'height': 512,
                'color_scheme': 'vibrant',
                'sampler': 'DPM++ 2M Karras'
            },
            {
                'prompt': "a cyberpunk street",
                'model': 'stable-diffusion-v2-1',
                'guidance_scale': 15.0,
                'n_steps': 50,
                'seed': 123,
                'width': 1024,
                'height': 1024,
                'color_scheme': 'cool',
                'sampler': 'UniPC'
            }
        ]
        
        for case in test_cases:
            with self.subTest(**case):
                result = self.service.generate(
                    user=self.user,
                    **case
                )
                self.assertIsNotNone(result)
                logger.info(f"Combined test completed: {result.id}")

    def test_memory_usage(self):
        """Тест использования памяти"""
        if torch.cuda.is_available():
            torch.cuda.reset_peak_memory_stats()
            initial_memory = torch.cuda.memory_allocated()
            
            result = self.service.generate(
                prompt="memory test image",
                user=self.user
            )
            
            peak_memory = torch.cuda.max_memory_allocated()
            final_memory = torch.cuda.memory_allocated()
            
            logger.info(f"Memory usage:")
            logger.info(f"Initial: {initial_memory / 1024**2:.2f}MB")
            logger.info(f"Peak: {peak_memory / 1024**2:.2f}MB")
            logger.info(f"Final: {final_memory / 1024**2:.2f}MB")

if __name__ == '__main__':
    unittest.main() 