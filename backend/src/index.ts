import express from "express";
import { executeC, generateFile } from "./execute";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/run", async (req, res) => {
  if (!req?.body?.code || !req.body?.lang) {
    return res.status(404).json({ error: "Invalid input" });
  }
  if (req.body.lang !== "c") {
    return res.status(200).json({ error: "We only support C for now!" });
  }
  const { code, lang } = req.body;
  const filepath = await generateFile(lang, code);
  const result = await executeC(filepath);
  return res.status(200).json({ result });
});

app.listen(8080, () => {
  console.log("listening on port 8080");
});
