MODEL_SUMMARY = "gpt-4.1-mini"

MAX_INPUT_TOKENS = 8_000
MAX_OUTPUT_TOKENS = 400

TEMPERATURE = 0.25

# rough cost tracking (USD / 1K tokens)
MODEL_COSTS = {
    "gpt-4.1-mini": {
        "input": 0.00015,
        "output": 0.0006,
    }
}
