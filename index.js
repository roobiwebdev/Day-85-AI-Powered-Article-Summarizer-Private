
const hfApiKey = import.meta.env.VITE_HUGGINGFACE_API_KEY;
fetch("https://api-inference.huggingface.co/models/facebook/bart-large-cnn", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${hfApiKey}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ inputs: "This is a test summary request." }),
})
  .then((res) => res.json())
  .then(console.log)
  .catch(console.error);
