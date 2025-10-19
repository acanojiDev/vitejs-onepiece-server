import { Observable, from, catchError, of } from "rxjs";
import type { Personaje, PersonajeCreate } from "../models/personaje.model";

const API_URL = 'http://127.0.0.1:8000';

export class ApiService {
	getPersonajes(): Observable<Personaje[]> {
		return from(
			fetch(`${API_URL}/personajes`)
				.then(response => {
					if (!response.ok) throw new Error('Error al obtener personajes');
					return response.json();
				})
		).pipe(
			catchError(error => {
				console.error('Error: ', error);
				return of([])
			})
		)
	}

	createPersonaje(personaje: PersonajeCreate): Observable<Personaje> {
		return from(
			fetch(`${API_URL}/personajes`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(personaje),
			})
				.then((response: Response) => {
					if (!response.ok) throw new Error('Error al crear personaje');
					return response.json();
				})
		).pipe(
			catchError((error: Error) => {
				console.error('Error:', error);
				throw error;
			})
		);
	}

	deletePersonaje(id: string): Observable<void> {
		return from(
			fetch(`${API_URL}/personajes/${id}`, {
				method: 'DELETE',
			} as RequestInit)  // ← AÑADIR "as RequestInit"
				.then((response: Response) => {  // ← AÑADIR tipo Response
					if (!response.ok) throw new Error('Error al eliminar personaje');
					return undefined;
				})
		).pipe(
			catchError((error: Error) => {
				console.error('Error:', error);
				throw error;
			})
		);
	}


	getTopRecompensas(limit: number = 5): Observable<Personaje[]> {
		return from(
			fetch(`${API_URL}/personajes/recompensa/top?limit=${limit}`)
				.then((response: Response) => {
					if (!response.ok) throw new Error('Error al obtener top');
					return response.json() as Promise<Personaje[]>;
				})
		).pipe(
			catchError((error: Error) => {
				console.error('Error:', error);
				return of([]);
			})
		);
	}


}

