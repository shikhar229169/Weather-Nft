if (!secrets.apiKey) {
  throw Error("Weather API Key is not available!")
}

const latitude = args[0]
const longitude = args[1]
const units = args[2]

const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${secrets.apiKey}&units=${units}`

//   console.log(`Sending HTTP request to ${url}lat=${latitude}&lon=${longitude}`)

const weatherRequest = Functions.makeHttpRequest({
  url: url,
  method: "GET",
})

// Execute the API request (Promise)
const weatherResponse = await weatherRequest
if (weatherResponse.error) {
  throw Error("Request failed, try checking the params provided")
}

const weather = weatherResponse.data.main.temp.toFixed(2)

return Functions.encodeUint256(weather * 100)
