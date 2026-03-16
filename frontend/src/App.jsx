import {useState,useRef,useEffect} from "react"
import axios from "axios"
import Webcam from "react-webcam"
import ReactMarkdown from "react-markdown"
import {motion} from "framer-motion"
import {FaVolumeUp,FaVolumeMute} from "react-icons/fa"
import Particles from "react-tsparticles"
import {loadFull} from "tsparticles"

export default function App(){

const title="AI LifeLens"

const [displayTitle,setDisplayTitle]=useState("")
const [index,setIndex]=useState(0)

const [image,setImage]=useState(null)
const [question,setQuestion]=useState("")
const [answer,setAnswer]=useState("")
const [loading,setLoading]=useState(false)

const [camera,setCamera]=useState(false)
const webcamRef=useRef(null)

const [history,setHistory]=useState([])
const [openHistory,setOpenHistory]=useState(null)

const [mute,setMute]=useState(false)

useEffect(()=>{

let interval=setInterval(()=>{

setDisplayTitle(title.substring(0,index+1))
setIndex(prev=>{

if(prev===title.length) return 0
return prev+1

})

},150)

return()=>clearInterval(interval)

},[index])

async function analyze(){

if(!image){
alert("upload image")
return
}

const formData=new FormData()
formData.append("file",image)
formData.append("question",question)

setLoading(true)

try{

const res=await axios.post(
"http://127.0.0.1:8000/analyze",
formData,
{headers:{"Content-Type":"multipart/form-data"}}
)

setAnswer(res.data.answer)

setHistory(prev=>[
{
image:URL.createObjectURL(image),
question,
answer:res.data.answer
},
...prev
])

if(!mute){

speechSynthesis.cancel()
let speech=new SpeechSynthesisUtterance(res.data.answer)
speechSynthesis.speak(speech)

}

}catch(e){

alert("AI analysis failed")

}

setLoading(false)

}

function capture(){

if(!webcamRef.current) return

const screenshot=webcamRef.current.getScreenshot()

fetch(screenshot)
.then(res=>res.blob())
.then(blob=>{
const file=new File([blob],"capture.jpg",{type:"image/jpeg"})
setImage(file)
})

}

function startVoice(){

const SpeechRecognition=window.SpeechRecognition||window.webkitSpeechRecognition
const recognition=new SpeechRecognition()

recognition.onresult=(e)=>{
const text=e.results[0][0].transcript
setQuestion(text)
}

recognition.start()

}

function toggleMute(){

speechSynthesis.cancel()
setMute(!mute)

}

return(

<div className="min-h-screen text-white bg-gradient-to-br from-slate-900 via-indigo-900 to-black">

{/* HERO */}

<div className="text-center pt-20">

<h1 className="text-6xl font-bold text-cyan-400">
{displayTitle}
</h1>

<p className="text-gray-400 mt-3">
See the world through AI Vision
</p>

</div>

{/* PROBLEM */}

<section className="max-w-5xl mx-auto text-center mt-20">

<motion.h2
initial={{opacity:0,y:40}}
whileInView={{opacity:1,y:0}}
transition={{duration:0.6}}
className="text-3xl font-bold">

Problem

</motion.h2>

<p className="text-gray-300 mt-4">

People struggle to quickly understand visual information such as medical
prescriptions, product instructions, devices, and complex scenes.

</p>

</section>

{/* SOLUTION */}

<section className="max-w-5xl mx-auto text-center mt-16">

<h2 className="text-3xl font-bold">

Solution

</h2>

<p className="text-gray-300 mt-4">

AI LifeLens is an intelligent multimodal AI assistant that analyzes images,
detects objects, extracts text, and provides actionable insights.

</p>

</section>

{/* FEATURES */}

<section className="grid grid-cols-4 gap-6 max-w-6xl mx-auto mt-16">

<div className="bg-white/10 p-6 rounded-xl">Object Detection</div>
<div className="bg-white/10 p-6 rounded-xl">Voice Interaction</div>
<div className="bg-white/10 p-6 rounded-xl">Live Camera Vision</div>
<div className="bg-white/10 p-6 rounded-xl">Gemini AI Analysis</div>

</section>

{/* DEMO */}

<section className="grid grid-cols-2 gap-10 max-w-7xl mx-auto mt-20">

{/* LEFT */}

<div className="bg-white/10 p-8 rounded-xl">

<h2 className="text-xl mb-4">Upload or Capture Image</h2>

<input type="file" onChange={(e)=>setImage(e.target.files[0])}/>

<button
onClick={()=>setCamera(!camera)}
className="bg-indigo-500 px-4 py-2 rounded ml-3">

Toggle Camera

</button>

{camera &&(

<div className="mt-4">

<Webcam
ref={webcamRef}
audio={false}
screenshotFormat="image/jpeg"
/>

<button
onClick={capture}
className="mt-2 bg-cyan-500 px-4 py-2 rounded">

Capture Image

</button>

</div>

)}

{image &&(

<img
src={URL.createObjectURL(image)}
className="rounded-xl mt-4"
/>

)}

<input
value={question}
onChange={(e)=>setQuestion(e.target.value)}
placeholder="Describe issue"
className="w-full mt-4 p-3 bg-slate-800 rounded"
/>

<div className="flex gap-3 mt-3">

<button
onClick={startVoice}
className="bg-green-500 px-4 py-2 rounded">

Speak Issue

</button>

<button
onClick={analyze}
className="bg-cyan-500 px-4 py-2 rounded">

Analyze Image

</button>

</div>

</div>

{/* RIGHT */}

<div className="bg-white/10 p-8 rounded-xl">

<div className="flex justify-between">

<h2 className="text-xl">AI Analysis</h2>

<button onClick={toggleMute}>
{mute?<FaVolumeMute/>:<FaVolumeUp/>}
</button>

</div>

{loading && <p className="text-cyan-400">AI analyzing...</p>}

{answer &&(

<div className="max-h-[300px] overflow-y-auto mt-4 prose prose-invert">

<ReactMarkdown>{answer}</ReactMarkdown>

</div>

)}

{/* AI SUGGESTIONS */}

<div className="grid grid-cols-2 gap-3 mt-6">

<button
onClick={()=>{setQuestion("Extract text from image");analyze()}}
className="bg-indigo-500 p-3 rounded">

Extract Text

</button>

<button
onClick={()=>{setQuestion("Translate prescription");analyze()}}
className="bg-purple-500 p-3 rounded">

Translate Prescription

</button>

<button
onClick={()=>{setQuestion("Summarize key information");analyze()}}
className="bg-cyan-500 p-3 rounded">

Summarize

</button>

<button
onClick={()=>{setQuestion("Generate reminder schedule");analyze()}}
className="bg-green-500 p-3 rounded">

Generate Reminder

</button>

</div>

{/* HISTORY */}

<div className="mt-6">

<h3 className="text-lg mb-2">Conversation History</h3>

<div className="max-h-[200px] overflow-y-auto space-y-3">

{history.map((item,i)=>(

<div
key={i}
onClick={()=>setOpenHistory(openHistory===i?null:i)}
className="bg-black/30 p-3 rounded cursor-pointer">

<img src={item.image} className="w-16 rounded"/>

<p className="text-cyan-300 text-sm">

Q: {item.question}

</p>

{openHistory===i &&(

<p className="text-gray-300 text-sm mt-2">

{item.answer}

</p>

)}

</div>

))}

</div>

</div>

</div>

</section>

{/* TECH */}

<section className="text-center mt-20 max-w-6xl mx-auto">

<h2 className="text-3xl font-bold">

Technology Stack

</h2>

<p className="text-gray-300 mt-4">

Frontend: React + Tailwind + Framer Motion  
Backend: FastAPI  
AI Models: Gemini Vision Model  
Object Detection: TensorFlow COCO-SSD  
Cloud: Google Cloud Platform

</p>

</section>

{/* GEMINI REQUIREMENT */}

<section className="text-center mt-20 max-w-6xl mx-auto pb-20">

<h2 className="text-3xl font-bold">

Gemini & Google Cloud Integration

</h2>

<p className="text-gray-300 mt-4">

This project leverages a Gemini Vision model via the Google GenAI SDK.
The AI agent analyzes images and provides contextual understanding.
The backend runs on FastAPI and can be deployed on Google Cloud services
such as Cloud Run or Vertex AI.

</p>

</section>

</div>

)

}