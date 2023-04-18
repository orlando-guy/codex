import { $ } from "../utils";

export class Modal {
    /**
     * 
     * @param {string} title 
     * @param {string} content 
     */
    constructor(title, content) {
        this.title = title;
        this.content = content
        this.closeModal = this.closeModal.bind(this)
    }

    /** 
     * @param {MouseEvent} e 
    */
    closeModal = e => {
        /** @type HTMLButtonElement */
        const button = e.currentTarget;
        const div = button.parentElement.parentElement.parentElement
        div.classList.remove('show')
        setTimeout(() => div.remove(), 2000);
        
    }

    /**
     * @param {HTMLElement} element
     */
    renderTo(element) {
        /** @type {DocumentFragment} */
        const template = $('#modalTemplate').content.cloneNode(true)
        const modalElement = template.firstElementChild

        modalElement.querySelector('.modal-content-header button').onclick = this.closeModal
        modalElement.querySelector('.modal-content-header h2').innerText = this.title
        modalElement.querySelector('.modal-content-body').innerHTML = this.content

        element.appendChild(modalElement)
    }
}