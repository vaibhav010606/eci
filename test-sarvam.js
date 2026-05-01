const fetch = require('node-fetch');

async function test() {
  const url = "https://api.sarvam.ai/text-to-speech";
  const apiKey = "sk_b9tbodgh_fzCEsmhYF4iKvLFHfY8kCDsJ";
  
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "api-subscription-key": apiKey,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      inputs: ["नमस्ते"],
      target_language_code: "hi-IN",
      speaker: "shubh",
      model: "bulbul:v3",
      speech_sample_rate: 22050,
      enable_preprocessing: true,
      output_format: "wav"
    })
  });
  
  console.log("Status:", res.status);
  const text = await res.text();
  console.log("Response starts with:", text.substring(0, 100));
}
test();
