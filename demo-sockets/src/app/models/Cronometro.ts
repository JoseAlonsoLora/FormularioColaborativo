export class Cronometro{
    private segundos: number;
    private minutos: number;
    private horas: number;
    private MAX_NUMBER = 60;

    constructor(){
        this.segundos = 0;
        this.minutos = 0;
        this.horas = 0;
    }

    public actualizarCronometro(){
        this.actualizarSegundos();    
        return this.formatoTiempo(this.horas) + ':' + this.formatoTiempo(this.minutos) + ':' + this.formatoTiempo(this.segundos);
      }

      private formatoTiempo(cantidad: number){
        return cantidad < 10 ? '0' + cantidad : cantidad;
      }
    
      private actualizarSegundos():void{
        this.segundos++;
        if (this.segundos === this.MAX_NUMBER){
          this.segundos = 0
          this.actualizarMinutos();
        }      
      }
    
      private actualizarMinutos(){
        this.minutos++;
        if (this.minutos === this.MAX_NUMBER){
          this.minutos = 0
          this.horas++;
        }
      }
}