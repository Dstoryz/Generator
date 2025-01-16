import torch
from diffusers import AutoPipelineForText2Image, EulerAncestralDiscreteScheduler, UniPCMultistepScheduler
from PIL import Image
import os
from datetime import datetime
import random

# Установка устройства и создание директории
device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"Using device: {device}")

results_dir = "test_results"
timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
test_dir = os.path.join(results_dir, timestamp)
os.makedirs(test_dir, exist_ok=True)

# Модели
MODELS = {
    "sd_v1.5": "runwayml/stable-diffusion-v1-5",
    "sd_v2.1": "stabilityai/stable-diffusion-2-1",

}

# Сэмплеры
SAMPLERS = {
    "euler_a": EulerAncestralDiscreteScheduler,
    "unipc": UniPCMultistepScheduler,
}

def load_model(model_name, sampler=None):
    print(f"Loading model: {model_name}")
    pipeline = AutoPipelineForText2Image.from_pretrained(
        model_name,
        torch_dtype=torch.float16,
        variant="fp16",
        use_safetensors=True
    ).to(device)
    
    if sampler:
        pipeline.scheduler = sampler.from_config(pipeline.scheduler.config)
    
    return pipeline

def generate_and_save(pipeline, params, filename_prefix):
    print(f"\nGenerating with parameters:")
    for k, v in params.items():
        print(f"{k}: {v}")
    
    # Генерация
    image = pipeline(**params).images[0]
    
    # Сохранение
    image_path = os.path.join(test_dir, f"{filename_prefix}.png")
    params_path = os.path.join(test_dir, f"{filename_prefix}.txt")
    
    image.save(image_path)
    with open(params_path, 'w', encoding='utf-8') as f:
        for k, v in params.items():
            f.write(f"{k}: {v}\n")
    
    print(f"Saved to {image_path}")
    return image

# Расширенные тестовые наборы
test_cases = [
    {
        "name": "photorealistic",
        "params": {
            "prompt": "Professional photograph of a serene lake at sunset, high resolution, 8K, masterful composition",
            "negative_prompt": "cartoon, painting, artificial, low quality, blurry, grainy",
            "num_inference_steps": 50,
            "guidance_scale": 7.5,
            "width": 1024,
            "height": 1024,
            "num_images_per_prompt": 1,
        }
    },
    {
        "name": "artistic_detailed",
        "params": {
            "prompt": "Intricate steampunk machinery with brass gears and steam pipes, detailed illustration",
            "negative_prompt": "simple, minimalist, photographic",
            "num_inference_steps": 40,
            "guidance_scale": 12.0,
            "width": 768,
            "height": 768,
        }
    },
]

# Тесты с разными guidance_scale
guidance_tests = [
    {
        "name": f"guidance_{scale}",
        "params": {
            "prompt": "A mystical forest with glowing crystals and magical creatures",
            "negative_prompt": "ugly, blurry, low quality",
            "num_inference_steps": 30,
            "guidance_scale": scale,
            "width": 768,
            "height": 768,
        }
    }
    for scale in [1.0, 3.0, 5.0, 7.5, 10.0, 15.0, 20.0]
]

# Тесты с разным количеством шагов
steps_tests = [
    {
        "name": f"steps_{steps}",
        "params": {
            "prompt": "Cyberpunk cityscape at night with neon lights and flying cars",
            "negative_prompt": "daytime, natural, rural",
            "num_inference_steps": steps,
            "guidance_scale": 7.5,
            "width": 768,
            "height": 768,
        }
    }
    for steps in [10, 20, 30, 40, 50, 75, 100]
]

# Тесты с разными размерами
size_tests = [
    {
        "name": f"size_{width}x{height}",
        "params": {
            "prompt": "Epic fantasy landscape with dragons and floating islands",
            "negative_prompt": "simple, minimal",
            "num_inference_steps": 30,
            "guidance_scale": 7.5,
            "width": width,
            "height": height,
        }
    }
    for width, height in [
        (512, 512), (768, 512), (512, 768),
        (1024, 1024), (1024, 768), (768, 1024)
    ]
]

# Тесты с разными сидами
seed_tests = [
    {
        "name": f"seed_{seed}",
        "params": {
            "prompt": "Portrait of a fantasy character with detailed armor",
            "negative_prompt": "simple, plain clothing",
            "num_inference_steps": 30,
            "guidance_scale": 7.5,
            "width": 768,
            "height": 768,
            "generator": torch.Generator(device=device).manual_seed(seed),
        }
    }
    for seed in [42, 123, 456, 789, 1024, 2048]
]

# Тесты с разными сэмплерами
sampler_tests = [
    {
        "name": f"sampler_{sampler_name}",
        "params": {
            "prompt": "Abstract cosmic nebula with vibrant colors",
            "negative_prompt": "",
            "num_inference_steps": 30,
            "guidance_scale": 7.5,
            "width": 768,
            "height": 768,
        },
        "sampler": sampler_class
    }
    for sampler_name, sampler_class in SAMPLERS.items()
]

# Тесты с разными моделями
model_tests = [
    {
        "name": f"model_{model_name}",
        "params": {
            "prompt": "A majestic mountain range at sunrise",
            "negative_prompt": "",
            "num_inference_steps": 30,
            "guidance_scale": 7.5,
            "width": 768,
            "height": 768,

        },
        "model": model_path
    }
    for model_name, model_path in MODELS.items()
]

def run_tests():
    print("Starting tests...")
    
    # Базовые тесты
    pipeline = load_model(MODELS["sd_v1.5"])
    for test in test_cases + guidance_tests + steps_tests + size_tests + seed_tests:
        try:
            generate_and_save(
                pipeline=pipeline,
                params=test["params"],
                filename_prefix=test["name"]
            )
        except Exception as e:
            print(f"Error in test {test['name']}: {str(e)}")
    
    # Тесты с разными сэмплерами
    for test in sampler_tests:
        try:
            pipeline = load_model(MODELS["sd_v1.5"], test["sampler"])
            generate_and_save(
                pipeline=pipeline,
                params=test["params"],
                filename_prefix=test["name"]
            )
        except Exception as e:
            print(f"Error in sampler test {test['name']}: {str(e)}")
    
    # Тесты с разными моделями
    for test in model_tests:
        try:
            pipeline = load_model(test["model"])
            generate_and_save(
                pipeline=pipeline,
                params=test["params"],
                filename_prefix=test["name"]
            )
        except Exception as e:
            print(f"Error in model test {test['name']}: {str(e)}")

if __name__ == "__main__":
    run_tests()