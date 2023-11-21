// tipos de votos
const AFIRMATIVO = "#6CC39F"
const NEGATIVO = "#F0686C"
const ABSTENCION = "#239FD9"
const AUSENTE = "#FAB860"
const SIN_VOTAR = "#707CD2"






//obtenido de https://votaciones.hcdn.gob.ar/votacion/4836

// URL del recurso https://pastebin.com/raw/iazJWx83
const titulo = "O.D. 67 - LEY 27.551, DE ALQUILERES. DICTAMEN DE MAYORIA. VOT. EN GRAL."
const url = 'resultados.json';


function obtener_datos(url){
    fetch(url, {
            method: 'GET',
            headers: {
            'Accept': 'application/json',
            },
        })
    .then(response => response.text())
    .then(response => {
        let resultados = JSON.parse(response)
        return resultados
        // [
        //     {
        //       "DIPUTADO": "AGOST CARREÑO, OSCAR",
        //       "BLOQUE": "Pro",
        //       "PROVINCIA": "Córdoba",
        //       "¿CÓMO VOTÓ?": "NEGATIVO"
        //     },
        //     {....
        //imprimir por consola
        // resultados.forEach(element => {
        //     console.log(element)
        // });
    })
    .catch(error => console.error('Error fetching JSON:', error));
}




// datos del SVG
const HEIGHT = 700
const WIDTH = 800
const cx = WIDTH/2
const cy = HEIGHT/2
const RADIO_CIRCULO = 30;
const svgns = "http://www.w3.org/2000/svg"
let container = document.getElementById( 'cont' );
container.setAttribute("height", HEIGHT)
container.setAttribute("width", WIDTH)


class Circle {
  constructor(contenedor, radio, angulo, radioCirc = RADIO_CIRCULO, color = "green"){
    this.r = radio;
    this.ang = angulo
    this.contenedor = contenedor
    this.radioCirc = radioCirc
    this.color = color
    this.circle = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
    this.draw()    
  }
  
  draw(){
    // coordenadas polares
    let x = this.r * Math.cos(this.ang) + cx
    let y = this.r * -Math.sin(this.ang) + cy   //el - porque en matematicas se cuenta en sentido contrario a las agujas del reloj
    this.circle.setAttributeNS(null, 'cx', x);
    this.circle.setAttributeNS(null, 'cy', y);
    this.circle.setAttributeNS(null, 'r', this.radioCirc);
    this.circle.setAttributeNS(null, 'style', 'fill: none; stroke:'+ this.color + '; stroke-width: 2px;' );
    this.contenedor.appendChild(this.circle);
  }
  
  update(contenedor, radio, angulo, radioCirc = RADIO_CIRCULO){
    this.r = radio;
    this.ang = angulo
    this.contenedor = contenedor
    this.radiusCirc = radioCirc
    this.draw()
  }
}





function dibujar_bancas_angularmente(){
    //contenedor circulos (luego darle forma de semi-esfera)
    const rGrande = 300
    new Circle(container, 0, 0, rGrande)

    // banca inicial
    const SEPARACION = 3
    let color = "red"
    let radio_coord = rGrande - RADIO_CIRCULO
    let ang_coord = 0 
    // angulo_tita = arco_circunf / radio
    let tita = (RADIO_CIRCULO*2 + SEPARACION)/radio_coord
    // Note: aca estoy aproximando arco_circunf ~= diametro
    let CANT_BANCAS = 41
    let factor_sep_bancas = 3

    for (let i=0; i < CANT_BANCAS; i++){
        // si llega al final del 2do cuadrante pasa al siguiente circulo interior
        if(ang_coord > Math.PI){
            ang_coord = 0
            radio_coord = rGrande - (RADIO_CIRCULO + SEPARACION * 0.5)*factor_sep_bancas + SEPARACION*0.5
            factor_sep_bancas = factor_sep_bancas + 2
            tita = (RADIO_CIRCULO*2 + SEPARACION)/radio_coord
            color = "blue"
            
        } else {
            let c2 = new Circle(container, radio_coord, ang_coord, RADIO_CIRCULO, color)
            // ang(n+1) = tita_i + ang(n) 
            ang_coord = tita + c2.ang
        }
    }
}

dibujar_bancas_angularmente()




// ejes principales
var forma = document.createElementNS(svgns, "line");
                forma.setAttributeNS(null, "x1", 0);
                forma.setAttributeNS(null, "y1", cy);
                forma.setAttributeNS(null, "x2", WIDTH + cx);
                forma.setAttributeNS(null, "y2", cy);
                forma.setAttributeNS(null, "stroke", "black");
container.appendChild(forma);

var forma2 = document.createElementNS(svgns, "line");
                forma2.setAttributeNS(null, "x1", cx);
                forma2.setAttributeNS(null, "y1", 0);
                forma2.setAttributeNS(null, "x2", cx);
                forma2.setAttributeNS(null, "y2", HEIGHT);
                forma2.setAttributeNS(null, "stroke", "black");
container.appendChild(forma2);