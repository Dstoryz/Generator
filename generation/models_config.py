import torch
from .constants import STYLE_OPTIONS, COLOR_SCHEME, SAMPLER_OPTIONS

MODEL_CONFIG = {
    "stable-diffusion-v1-5": {
        "path": "runwayml/stable-diffusion-v1-5",
        "torch_dtype": torch.float16,
        "parameters": {
            "steps": {
                "min": 20,
                "max": 100,
                "default": 30,
                "enabled": True
            },
            "guidance_scale": {
                "min": 1.0,
                "max": 20.0,
                "default": 7.5,
                "enabled": True
            },
            "width": {
                "options": [512, 768, 1024],
                "default": 512,
                "enabled": True
            },
            "height": {
                "options": [512, 768, 1024],
                "default": 512,
                "enabled": True
            },
            "sampler": {
                "enabled": False,
                "default": "DPM++ 2M Karras",
                "options": [option["value"] for option in SAMPLER_OPTIONS]
            },
            "safety_checker": {
                "enabled": False,
                "default": True
            },
            "tiling": {
                "enabled": False,
                "default": False
            },
            "hires_fix": {
                "enabled": False,
                "default": False
            },
            "negative_prompt": {
                "enabled": True
            },
            "seed": {
                "enabled": True
            }
        }
    },
    "stable-diffusion-2-1": {
        "path": "stabilityai/stable-diffusion-2-1",
        "torch_dtype": torch.float16,
        "variant": "fp16",
        "parameters": {
            "steps": {
                "min": 30,
                "max": 120,
                "default": 60,
                "enabled": True
            },
            "guidance_scale": {
                "min": 1.0,
                "max": 20.0,
                "default": 9.0,
                "enabled": True
            },
            "width": {
                "options": [512, 768, 1024],
                "default": 512,
                "enabled": True
            },
            "height": {
                "options": [512, 768, 1024],
                "default": 512,
                "enabled": True
            },
            "sampler": {
                "enabled": False,
                "default": "DPM++ 2M Karras",
                "options": ["DPM++ 2M Karras", "Euler a", "UniPC"]
            },
            "safety_checker": {
                "enabled": False,
                "default": True
            },
            "tiling": {
                "enabled": False,
                "default": False
            },
            "hires_fix": {
                "enabled": False,
                "default": False
            },
            "negative_prompt": {
                "enabled": True
            },
            "seed": {
                "enabled": True
            }
        }
    },
    "openjourney-v4": {
        "path": "prompthero/openjourney-v4",
        "torch_dtype": torch.float16,
        "parameters": {
            "steps": {
                "min": 20,
                "max": 80,
                "default": 40,
                "enabled": True
            },
            "guidance_scale": {
                "min": 1.0,
                "max": 15.0,
                "default": 8.5,
                "enabled": True
            },
            "width": {
                "options": [512, 768],
                "default": 512,
                "enabled": True
            },
            "height": {
                "options": [512, 768],
                "default": 512,
                "enabled": True
            },
            "sampler": {
                "enabled": False,
                "default": "Euler a",
                "options": ["Euler a", "DPM++ 2M Karras"]
            },
            "safety_checker": {
                "enabled": False,
                "default": True
            },
            "tiling": {
                "enabled": False,
                "default": False
            },
            "hires_fix": {
                "enabled": False,
                "default": False
            },
            "negative_prompt": {
                "enabled": True
            },
            "seed": {
                "enabled": True
            }
        }
    }
}

COMMON_SETTINGS = {
    "style": {
        "enabled": True,
        "default": "none",
        "options": [option["value"] for option in STYLE_OPTIONS]
    },
    "color_scheme": {
        "enabled": True,
        "default": "none",
        "options": [option["value"] for option in COLOR_SCHEME]
    }
}
