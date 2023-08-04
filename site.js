const APP_ID = '9f028011de7ecd1242e1f4441bf61614';
const DEFAULT_VALUE ='--'

const searchInput = document.querySelector("#search-input");
const cityName = document.querySelector(".city-name");
const weatherState = document.querySelector(".weather-state");
const weatherIcon = document.querySelector(".weather-icon");
const temperature = document.querySelector(".temperature");
const container = document.querySelector('.container');

const sunrise = document.querySelector(".sunrise");
const sunset = document.querySelector(".sunset");
const humidity = document.querySelector('.humidity');
const windSpeed = document.querySelector(".wind-speed");

searchInput.addEventListener('change', (e) =>{
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${e.target.value}&appid=${APP_ID}&units=metric&lang=vi`)
    .then(async res =>{
        const data = await res.json();
        cityName.innerHTML = data.name || DEFAULT_VALUE; 
        weatherState.innerHTML = data.weather[0].description || DEFAULT_VALUE;
        weatherIcon.setAttribute('src',`http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);
        temperature.innerHTML = Math.round(data.main.temp) || DEFAULT_VALUE;

        sunrise.innerHTML = moment.unix(data.sys.sunrise).format('H: mm') || DEFAULT_VALUE;
        sunset.innerHTML = moment.unix(data.sys.sunset).format('H: mm') || DEFAULT_VALUE;
        humidity.innerHTML = data.main.humidity || DEFAULT_VALUE;
        windSpeed.innerHTML = (data.wind.speed * 3.6 ).toFixed(2)|| DEFAULT_VALUE;
    });
})

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;

const recognition = new SpeechRecognition();
const sysnth = window.speechSynthesis;

recognition.lang="vi-VI";
recognition.continuous = false;

const microphone = document.querySelector('.microphone');

const speak = (text) =>{
    if(sysnth.speaking){
        console.log("Busy, Speaking");
        return;
    }

    const utter = new SpeechSynthesisUtterance(text);

    utter.onend = () => {
        console.log("SpeechSynthesisUtterance.onend");
    }

    utter.onerror = () =>{
        console.log("SpeechSynthesisUtterance.onend: ",err);
    }

    sysnth.speak(utter);
}


const handleVoice = (text) =>{
    const handleText = text.toLowerCase();
    if(handleText.includes('thời tiết tại')){
       const location = handleText.split('tại')[1].trim();
       searchInput.value = location;
       const changeEvenet = new Event('change');
       searchInput.dispatchEvent(changeEvenet);
       return;
    }

    if(handleText.includes('thay đổi màu nền')){
        const color = handleText.split('màu nền')[1].trim();
        console.log(color)
        container.style.background = color;
        return;
    }

    if(handleText.includes('màu nền mặc định')){
        container.style.background = '';
        return;
    }

    if(handleText.includes('mấy giờ')){
       const textToSpeech = `${moment().hours()} hours ${moment().minutes()} minutes`
       speak(textToSpeech);
       return;
    }   
    speak('Try again')
}

microphone.addEventListener('click', (e)=>{
    e.preventDefault();

    recognition.start();
    microphone.classList.add('recording');
})

recognition.onspeechend = () =>{
    recognition.stop();
    microphone.classList.remove('recording');
}

recognition.onerror = (err) =>{
    console.log(err);
    microphone.classList.remove('recording');
}

recognition.onresult = (e) => {

    const text =e.results[0][0].transcript;
    handleVoice(text);
}