---
title: Code layout test page
date: 2023-07-23
---

I'm `inline` ya dig.

```python
def main():
    # Setup device
    device = torch.device(
        f"cuda:{args.device}"
        if torch.cuda.is_available() and args.device != "cpu"
        else "cpu"
    )
    args.device = device

    # Set seed
    set_seed(args)

    # Load the models
    if args.continue_training:
        args.model_name_or_path = args.out_dir
    # Delete the current results file
    else:
        eval_results_file = os.path.join(args.out_dir, "eval_results.txt")
        if os.path.exists(eval_results_file):
            os.remove(eval_results_file)

    tokenizer, model = init_model(args.model_name_or_path, args)

    args.block_size = tokenizer.max_len_single_sentence
    model.to(args.device)
    logger.info(f"Training/evaluation parameters {args}")

    # Add special tokens (if loading a model before fine-tuning). Don't always need all
    # of these, but I think adding them all always doesn't hurt.
    if len(tokenizer.added_tokens_encoder) == 0:
        special_tokens = list(
            set(
                get_all_attributes(pd.read_csv(args.data_path, delimiter="\t"))
                + [
                    "[attrs]",
                    "[rot]",
                    "[action]",
                    "[rot_and_attrs]",
                    "[action_and_attrs]",
                    "<pad>",
                    "<eos>",
                ]
                + get_demo_special_tokens()
            )
        )
```

<p class="figcaption">Some code that's probably a bit too wide for narrow views.</p>
