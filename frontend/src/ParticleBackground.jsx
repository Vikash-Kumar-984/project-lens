import Particles from "react-tsparticles"
import { loadFull } from "tsparticles"

export default function ParticleBackground(){

async function particlesInit(main){
await loadFull(main)
}

return(

<Particles
id="tsparticles"
init={particlesInit}
options={{
background:{color:"transparent"},
particles:{
number:{value:80},
color:{value:"#00ffff"},
links:{
enable:true,
distance:150,
color:"#00ffff",
opacity:0.4
},
move:{
enable:true,
speed:1
},
size:{value:2}
}
}}
/>

)

}