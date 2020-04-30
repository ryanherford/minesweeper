export default {
    "tile": {
        "default": {
            "flag": "🚩",
            "mine": "💣",
            "active": "",
            "inactive": "",
            "contentMap": ""
        },
        "lines": {
            "flag": "./assets/flag.svg",
            "mine": "./assets/mine.svg",
            "active": "",
            "inactive": "",
            "contentMap": ""
        },
        "shapes": {
            "flag": "",
            "mine": "",
            "active": "",
            "inactive": "",
            "contentMap": ""
        },
        "minimal": {
            "flag": "",
            "mine": "",
            "active": "",
            "inactive": "",  
        },
        "literal": {
            "flag": "[F]",
            "mine": "X",
            "active": "",
            "inactive": "[ ]",
        }
    },
    "smiley": {
        "default": {
            'c' : '😀',
            'x' : '😵',
            'o' : '😧',
            'w' : '😎',
            'a' : '🤩'
        },
        "shapes":{
            'c': '(o v o)',
            'x': '(x _ x)',
            'o': '(- o -)',
            'w': '(> 3 <)',
            'a': '(* v *)',
        },
        "lines":{
            'c': '☉',
            'x': '☟',
            'o': '⚠',
            'w': '☼',
            'a': '☯',
        },
        "literal":{
            'c': 'ok',
            'x': 'lost',
            'o': '-',
            'w': 'won',
            'a': 'reset',
        },
        "minimal":{
            'c': 'o',
            'x': 'x',
            'o': '-',
            'w': 'w',
            'a': '.',
        },
    },
    "difficultyMapping": {
        "easy": {"height": 9, "width": 9, "mines": 10},
        "medium": {"height": 16, "width": 16, "mines": 40},
        "hard": {"height": 16, "width": 30, "mines": 99},
        "extreme": {"height": 24, "width": 30, "mines": 180},
    }
}

