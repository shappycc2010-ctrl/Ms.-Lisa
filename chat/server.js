app.post("/chat", async (req, res) => {
  const { text } = req.body;
  console.log(`🗣️ Shappy said: ${text}`);

  let reply = "I'm here, Shappy 💼";
  if (text.toLowerCase().includes("hello")) reply = "Hello boss Shappy 👋";
  if (text.toLowerCase().includes("mail")) reply = "Would you like me to check your Gmail?";
  if (text.toLowerCase().includes("remind")) reply = "Sure! What should I remind you about?";
  
  res.json({ reply });
});
