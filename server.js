const express = require("express");
const { Configuration, OpenAIApi } = require("openai");
const app = express();
require("dotenv").config();

const cors = require("cors");

app.use(cors());

app.use(express.json()); // for parsing application/json

const configuration = new Configuration({
  organization: process.env.ORGANIZATION,
  apiKey: process.env.API_KEY,
});

const openai = new OpenAIApi(configuration);

async function generateCompletion(userInput) {
  const sample1 = {
    location: "Uttara",
    tags: [],
    nOfPeople: 2,
    famFriendly: false,
    coupFriendly: true,
    partyFriendly: null,
    meal: null,
    budget: null,
    mainIngredient: null,
  };

  const sample2 = {
    location: "Dhanmondi",
    tags: [],
    nOfPeople: 15,
    famFriendly: null,
    coupFriendly: null,
    partyFriendly: true,
    meal: true,
    budget: 300,
    mainIngredient: null,
  };

  const sample3 = {
    location: "Banani",
    tags: [],
    nOfPeople: 2,
    famFriendly: null,
    coupFriendly: null,
    partyFriendly: null,
    meal: null,
    budget: 1000,
    mainIngredient: "chicken",
  };

  const sample4 = {
    location: "Mohammadpur",
    tags: ["pasta"],
    nOfPeople: 2,
    famFriendly: false,
    coupFriendly: true,
    partyFriendly: null,
    meal: null,
    budget: null,
    mainIngredient: "beef",
  };

  const sample5 = {
    location: "Dhaka",
    tags: ["biriani", "tehari"],
    nOfPeople: 2,
    famFriendly: false,
    coupFriendly: true,
    partyFriendly: null,
    meal: null,
    budget: 500,
    mainIngredient: null,
  };

  const sample6 = {
    location: "",
    tags: ["chap", "naan"],
    nOfPeople: 2,
    famFriendly: true,
    coupFriendly: false,
    partyFriendly: null,
    meal: null,
    budget: 500,
    mainIngredient: null,
  };

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "You have to generate JSON objects from user prompts. If you don't understand what the user is saying and you cannot generate a JSON object, then you return the json object with all empty values.You have to understand the occasion and set the famFriendly (family friendly), coupFriendly (couple friendly), partyFriendly (party friendly) fields. The main ingredient field only can contain these values: chicken, beef, mutton, vegetables, coffee, drink, dessert, fish.",
      },
      { role: "user", content: "find me a date place for 2 at uttara" },
      { role: "assistant", content: JSON.stringify(sample1) },
      {
        role: "user",
        content:
          "birthday party with 15 of my friends in Dhanmondi, per person budget is 300 taka. I would prefer set menu.",
      },
      { role: "assistant", content: JSON.stringify(sample2) },
      {
        role: "user",
        content:
          "I am craving chicken today. Suggest me something in banani to go with a friend, budget 1000 taka.",
      },
      { role: "assistant", content: JSON.stringify(sample3) },
      {
        role: "user",
        content:
          "Looking for a date place in Mohammadpur. I want to eat beef pasta.",
      },
      { role: "assistant", content: JSON.stringify(sample4) },
      {
        role: "user",
        content:
          "Looking for a date place in Dhaka. We want to eat biriani or tehari. Budget is 500 taka.",
      },
      { role: "assistant", content: JSON.stringify(sample5) },
      {
        role: "user",
        content: "I want to go out with my mom to eat chap with naan.",
      },
      { role: "assistant", content: JSON.stringify(sample6) },
      { role: "user", content: userInput }, // Use the userInput here
    ],
  });

  // Return the assistant's response
  return completion.data.choices[0].message.content;
}

app.post("/generate-filter", async (req, res) => {
  const userInput = req.body.userInput;

  try {
    const filterString = await generateCompletion(userInput);

    // Parse the string to JSON
    const filterObject = JSON.parse(filterString);

    // Set default values for the filter
    const defaultFilter = {
      location: "",
      tags: [],
      nOfPeople: 0,
      famFriendly: null,
      coupFriendly: null,
      partyFriendly: null,
      occasion: null,
      meal: null,
      budget: 0,
      mainIngredient: "",
    };

    const finalFilterObject = { ...defaultFilter, ...filterObject };

    res.json(finalFilterObject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error generating filter" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
