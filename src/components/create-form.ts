import { Subject } from 'rxjs';
import type { PersonajeCreate } from '../models/personaje.model';

export class CreateForm {
	private formSubmit$ = new Subject<PersonajeCreate>();

	render(): string {
		return `
		<div class="form-container">
			<h2>Crear Nuevo Personaje</h2>
			<form id="personajeForm">
				<div class="form-group">
					<label for="nombre">Nombre:</label>
					<input type="text" id="nombre" name="nombre" required
                    placeholder="Monkey D. Luffy">
				</div>

				<div class="form-group">
					<label for="recompensa">Recompensa (Berries):</label>
					<input type="number" id="recompensa" name="recompensa" required
					placeholder="3000000000">
				</div>

				<div class="form-group">
							<label for="fruta_diablo">Fruta del Diablo:</label>
							<input type="text" id="fruta_diablo" name="fruta_diablo"
							placeholder="Gomu Gomu no Mi (opcional)">
				</div>

				<div class="form-group">
							<label for="tripulacion">Tripulación:</label>
							<input type="text" id="tripulacion" name="tripulacion" required
							placeholder="Piratas del Sombrero de Paja">
				</div>

				<div class="form-group">
							<label for="rol">Rol:</label>
							<input type="text" id="rol" name="rol" required
							placeholder="Capitán">
				</div>

				<div class="form-group">
					<label for="img">URL de Imagen:</label>
					<input type="url" id="img" name="img">
				</div>

				<button type="submit" class="btn-primary">Crear Personaje</button>
			</form>
		</div>
		`;
	}

	attachEventListeners(): void {
		const form = document.getElementById('personajeForm') as HTMLFormElement;

		form?.addEventListener('submit', (e) => {
			e.preventDefault();

			const formData = new FormData(form);
			const frutaDiablo = formData.get('fruta_diablo') as string;
			const imgValue = formData.get('img') as string;

			const personaje: PersonajeCreate = {
				nombre: formData.get('nombre') as string,
				recompensa: parseInt(formData.get('recompensa') as string),
				fruta_diablo: frutaDiablo.trim() === '' ? null : frutaDiablo,
				tripulacion: formData.get('tripulacion') as string,
				rol: formData.get('rol') as string,
				img: imgValue && imgValue.trim() !== '' ? imgValue : null
			};

			this.formSubmit$.next(personaje);
			form.reset();
		});
	}

	get onSubmit$() {
		return this.formSubmit$.asObservable();
	}


}
