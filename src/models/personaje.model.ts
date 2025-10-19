export interface Personaje{
	id?:string;
	nombre:string;
	recompensa:number;
	fruta_diablo:string | null;
	tripulacion: string;
	rol:string;
	img?: string | null;
}

export interface PersonajeCreate{
	nombre: string;
	recompensa: number;
	fruta_diablo: string | null;
	tripulacion: string;
	rol: string;
	img?: string | null;
}
