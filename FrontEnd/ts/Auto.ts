class Auto{
    public patente:string;
    public color:string;
    public marca:string;
    public especial:string;
    constructor(patente:string,marca:string,color:string,especial:boolean){
        this.marca = marca;
        this.color = color;
        this.patente = patente;
        this.especial = especial?'1':'0';
    }
    
}