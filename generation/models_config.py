import torch

MODEL_CONFIG = {
    "stable-diffusion-v1-5": {
        "path": "stable-diffusion-v1-5/stable-diffusion-v1-5",
        "torch_dtype": torch.float16,
        "variant": "fp16",
        "default_settings": {
            "guidance_scale": 7.5,
            "num_inference_steps": 50,
            "negative_prompt": "",
            "width": 512,
            "height": 512,
            "safety_checker": True,
            "sampler": "DPM++ 2M Karras",  # или "Euler a", "DDIM", etc.
            "clip_skip": 1,
            "tiling": False,
            "hires_fix": False,
            "denoising_strength": 0.7,
        }
    },
    "stable-diffusion-2-1": {
        "path": "stabilityai/stable-diffusion-2-1",
        "torch_dtype": torch.float16,
        "variant": "fp16",
        "default_settings": {
            "guidance_scale": 8.0,
            "num_inference_steps": 60,
            "negative_prompt": "",
            "width": 768,
            "height": 768,
            "safety_checker": True,
            "sampler": "DPM++ 2M Karras",
            "clip_skip": 2,
            "tiling": False,
            "hires_fix": True,
            "denoising_strength": 0.6,
        }
    },
    "openjourney-v4": {
        "path": "prompthero/openjourney-v4",
        "torch_dtype": torch.float16,
     },
}

#
# MODEL_CONFIG = {
#     "stable-diffusion-v1-5": {
#         "path": "stable-diffusion-v1-5/stable-diffusion-v1-5",
#         "torch_dtype": torch.float16,
#         "variant": "fp16",
#         "seed": -1,
#         "sampling_method": "DDIM",
#         "cfg_scale": 7.5,
#         "resolution": (512, 512),
#         "denoising_strength": 0.75,
#         "hires_fix": True,
#         "batch_size": 1,
#         "tiling": False,
#     },
#     "stable-diffusion-2-1": {
#         "path": "stabilityai/stable-diffusion-2-1",
#         "torch_dtype": torch.float16,
#         "variant": "fp16",
#         "seed": -1,
#         "sampling_method": "Euler",
#         "cfg_scale": 8.0,
#         "resolution": (512, 512),
#         "denoising_strength": 0.7,
#         "hires_fix": True,
#         "batch_size": 1,
#         "tiling": False,
#     },
#     "openjourney-v4": {
#         "path": "prompthero/openjourney-v4",
#         "torch_dtype": torch.float16,
#         "seed": -1,
#         "sampling_method": "LMS",
#         "cfg_scale": 9.0,
#         "resolution": (512, 512),
#         "denoising_strength": 0.8,
#         "hires_fix": True,
#         "batch_size": 1,
#         "tiling": False,
#     },
# }
