const express = require("express");
const app = express();
const fs = require("fs/promises");
const PORT = 5678;
app
  .use(express.json())
  .use(
    express.urlencoded({
      extended: false,
    })
  )
  .use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "*");
    next();
  });
app.get("/playerCards", async (req, res) => {
  try {
    const playerCards = await fs.readFile("./playerCards.json");
    res.send(JSON.parse(playerCards));
  } catch (error) {
    res.status(500).send({
      error: error.stack,
    });
  }
});
app.post("/playerCards", async (req, res) => {
  try {
    const playerCard = req.body;
    const listBuffer = await fs.readFile("./playerCards.json");
    const currentplayerCards = JSON.parse(listBuffer);
    let maxplayerCardId = 1;
    if (currentplayerCards && currentplayerCards.length > 0) {
      maxplayerCardId = currentplayerCards.reduce(
        (maxId, currentElement) =>
          currentElement.id > maxId ? currentElement.id : maxId,
        maxplayerCardId
      );
    }
    const newplayerCard = {
      id: maxplayerCardId + 1,
      ...playerCard,
    };
    const newList = currentplayerCards ? [...currentplayerCards, newplayerCard] : [newplayerCard];
    await fs.writeFile("./playerCards.json", JSON.stringify(newList));
    res.send(newplayerCard);
  } catch (error) {
    res.status(500).send({
      error: error.stack,
    });
  }
});
app.delete("/playerCards/:id", async (req, res) => {
  console.log(req);
  try {
    const id = req.params.id;
    const listBuffer = await fs.readFile("./playerCards.json");
    const currentplayerCards = JSON.parse(listBuffer);
    if (currentplayerCards.length > 0) {
      await fs.writeFile(
        "./playerCards.json",
        JSON.stringify(currentplayerCards.filter((playerCard) => playerCard.id != id))
      );
      res.send({
        message: `Uppgift med id ${id} togs bort`,
      });
    } else {
      res.status(404).send({
        error: "Ingen uppgift att ta bort",
      });
    }
  } catch (error) {
    res.status(500).send({
      error: error.stack,
    });
  }
});
app.patch("/playerCards/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;
    const listBuffer = await fs.readFile("./playerCards.json");
    const currentplayerCards = JSON.parse(listBuffer);
    const updatedList = currentplayerCards.map((playerCard) =>
      playerCard.id == id ? { ...playerCard, ...updatedData } : playerCard
    );
    await fs.writeFile("./playerCards.json", JSON.stringify(updatedList));
    res.send({
      message: `Uppgift med id ${id} uppdaterad`,
    });
  } catch (error) {
    res.status(500).send({
      error: error.stack,
    });
  }
});
app.listen(PORT, () => console.log("Server running on http://localhost:5678"));
