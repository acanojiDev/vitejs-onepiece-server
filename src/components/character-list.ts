import type { Personaje } from '../models/personaje.model';
import { Subject } from 'rxjs';

export class CharacterList {
	private deleteClick$ = new Subject<string>();

	render(personajes: Personaje[]): string {
		if (personajes.length === 0) {
			return `
        <div class="characters-container">
          <h2>📋 Lista de Personajes</h2>
          <p class="empty-message">No hay personajes registrados</p>
        </div>
      `;
		}

		return `
      <div class="characters-container">
        <h2>📋 Lista de Personajes (${personajes.length})</h2>
        <div class="characters-grid">
          ${personajes.map(p => this.renderCard(p)).join('')}
        </div>
      </div>
    `;
	}

	private renderCard(personaje: Personaje): string {
		const formatRecompensa = (num: number) => {
			return new Intl.NumberFormat('es-ES').format(num);
		};

		const imgUrl = personaje.img && personaje.img.trim() !== ''
			? personaje.img
			: 'https://via.placeholder.com/300x400/667eea/ffffff?text=Sin+Imagen';

		return `
			<div class="character-card" data-id="${personaje.id}">
				<div class="character-image">
			<img
				src="${imgUrl}"
				alt="${personaje.nombre}"
			>
        </div>
			<h3>${personaje.nombre}</h3>
			<div class="character-info">
			<p><strong>💰 Recompensa:</strong> ₿${formatRecompensa(personaje.recompensa)}</p>
			<p><strong>🍎 Fruta:</strong> ${personaje.fruta_diablo || 'Ninguna'}</p>
			<p><strong>🚢 Tripulación:</strong> ${personaje.tripulacion}</p>
			<p><strong>⚔️ Rol:</strong> ${personaje.rol}</p>
			</div>
			<button class="btn-delete" data-id="${personaje.id}">🗑️ Eliminar</button>
		</div>
    `;
	}

	attachEventListeners(): void {
		const container = document.getElementById('characters');

		container?.addEventListener('click', (e) => {
			const target = e.target as HTMLElement;

			if (target.classList.contains('btn-delete')) {
				const id = target.getAttribute('data-id');
				if (id && confirm('¿Eliminar este personaje?')) {
					this.deleteClick$.next(id);
				}
			}
		});
	}

	get onDelete$() {
		return this.deleteClick$.asObservable();
	}
}
