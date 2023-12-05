## Getting started

To run code, run the following command

```bash
  npm install prompt-sync
  node "./index.js"
```

# My approach to solving the problem is as follows:

1.For each offer in the given list of offers, I first check if the offer is valid based on the provided criteria. If the offer is valid, I proceed to the next step; otherwise, I skip it.

2.For valid offers, I sort the associated merchants and select the closest one. This step ensures that I am considering only the closest merchant for each valid offer.

3.After determining the closest merchant for each valid offer, I proceed to filter these offers based on the category and proximity rules. If an offer has the same category as an offer already in the filtered list, I choose the one with the closer merchant. If the category is not present in the filtered list, I add the offer to the filtered list.

4.At this point, I have a filtered list containing the closest and valid offers for each category.

5.Finally, I sort the filtered list and select up to two offers, ensuring they belong to different categories and prioritizing the closest merchants.
