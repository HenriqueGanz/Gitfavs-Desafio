import { GithubUser } from "./GithubUsers.js"

//classe que vai conter a logica de dados
export class Favorites {
    constructor(root) {
        this.root = document.querySelector(root)
        this.load()
    }

    load() {
        this.entries = JSON.parse(localStorage.getItem('@git-favs:')) || []
    }
    
    save () {
        localStorage.setItem('@git-favs:', JSON.stringify(this.entries))
    }
    
    async add(username) {
        try {

            const userExists = this.entries.find(entry => entry.login === username)

             if(userExists) {
               throw new Error('Usuário já existe na lista')
             }

            const user = await GithubUser.search(username)

            if (user.login === undefined) {
                throw new Error('Usuário não encontrado!')
            }

            this.entries = [user, ...this.entries]
            this.update()
            this.save()

        }catch(error) {
            alert(error.message)
        } 
       }

    delete(user) {
        const filteredEntries = this.entries.filter(entry =>
            entry.login !== user.login)

            this.entries = filteredEntries
            this.update()
            this.save()
    }

}


//classe que vai criar a visualizacao no HTML
export class FavoritesView extends Favorites {
    constructor(root) {
        super(root)

        this.tbody = this.root.querySelector('table tbody')

        this.update()
        this.onadd()
   }

   onadd() {
    const addButton = this.root.querySelector('.search button')

    addButton.onclick = () => {
        const { value } = this.root.querySelector(`.search input`)
        this.add(value)
    }
   }

    update() {
        this.removeAllTr()

        this.entries.forEach(user => {
            const row = this.createRow()

            row.querySelector('.user img').src = `https://github.com/${user.login}.png`
            row.querySelector('.user img').alt = `Imagem de ${user.name}`
            row.querySelector('.user a').href = `https://github.com/${user.login}`
            row.querySelector('.user p').textContent = `${user.login}`
            row.querySelector('.user span').textContent = `${user.name}`
            row.querySelector('.repositories').textContent = `${user.public_repos}`
            row.querySelector('.followers').textContent = `${user.followers}`
            row.querySelector('.removeButton').onclick = () => {
                const isOk = confirm('Tem certeza que deseja remover essa linha?')

                if(isOk) {
                    this.delete(user)
                }
            }

            this.tbody.append(row)
        })



    }

    removeAllTr() {
        this.tbody.querySelectorAll('tr').forEach((tr) => {
            tr.remove()
    })


    }

    createRow() {
        const tr = document.createElement('tr')

        const content = `
        <td class="user">
        <img src="https://github.com/henriqueganz.png" alt="Imagem de Henrique Ganz">
        <a href="https://github.com/henriqueganz" target="_blank">
        <span>Henrique Ganz</span>
        <p>henriqueganz</p>
        </a>
        </td>
        <td class="repositories">123</td>
        <td class="followers">1234</td>
        <td class="removeButton"><button>&times;</button></td>
        `

        tr.innerHTML = content

        return tr

    }

}
