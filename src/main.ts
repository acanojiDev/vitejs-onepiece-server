import { ApiService } from './services/api.service';
import { CreateForm } from './components/create-form';
import { CharacterList } from './components/character-list';
import { renderHeader } from './components/header';
import { switchMap, tap } from 'rxjs/operators';
import './style.css';

// Inicializar servicios y componentes
const apiService = new ApiService();
const createForm = new CreateForm();
const characterList = new CharacterList();

// Función para cargar y mostrar personajes
function loadCharacters() {
  apiService.getPersonajes().subscribe({
    next: (personajes) => {
      const container = document.getElementById('characters');
      if (container) {
        container.innerHTML = characterList.render(personajes);
        characterList.attachEventListeners();
      }
    },
    error: (error) => {
      console.error('Error al cargar personajes:', error);
      showMessage('❌ Error al cargar personajes', 'error');
    }
  });
}

// Función para mostrar mensajes
function showMessage(message: string, type: 'success' | 'error') {
  const existingMessage = document.querySelector('.message');
  if (existingMessage) {
    existingMessage.remove();
  }

  const messageDiv = document.createElement('div');
  messageDiv.className = `message message-${type}`;
  messageDiv.textContent = message;
  document.body.insertBefore(messageDiv, document.body.firstChild);

  setTimeout(() => messageDiv.remove(), 3000);
}

// Inicializar la aplicación
function initApp() {
  // Renderizar header
  const header = document.querySelector('header');
  if (header) {
    header.innerHTML = renderHeader();
  }

  // Renderizar formulario
  const createSection = document.getElementById('create_section');
  if (createSection) {
    createSection.innerHTML = createForm.render();
    createForm.attachEventListeners();
  }

  // Cargar personajes iniciales
  loadCharacters();

  // Suscribirse al evento de crear personaje
  createForm.onSubmit$
    .pipe(
      tap(() => showMessage('⏳ Creando personaje...', 'success')),
      switchMap(personaje => apiService.createPersonaje(personaje))
    )
    .subscribe({
      next: () => {
        showMessage('✅ Personaje creado correctamente', 'success');
        loadCharacters();
      },
      error: (error) => {
        console.error('Error:', error);
        showMessage('❌ Error al crear personaje', 'error');
      }
    });

  // Suscribirse al evento de eliminar personaje
  characterList.onDelete$
    .pipe(
      tap(() => showMessage('⏳ Eliminando personaje...', 'success')),
      switchMap(id => apiService.deletePersonaje(id))
    )
    .subscribe({
      next: () => {
        showMessage('✅ Personaje eliminado correctamente', 'success');
        loadCharacters();
      },
      error: (error) => {
        console.error('Error:', error);
        showMessage('❌ Error al eliminar personaje', 'error');
      }
    });
}

// Iniciar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initApp);
