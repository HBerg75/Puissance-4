class Puissance4 {
    constructor(selector = "#game") {
        this.col = 7
        this.lgn = 6
        this.selector = selector
        this.tableauP4()
        this.ecoute()
        this.player = 'red'
        this.gagnant()
    }
    // this = endroit ou je me situe , 
    // affichage 
    tableauP4 = () => {
        const jeu = $(this.selector) // on veut que le jeu soit = a ce qu'on lui a passer en parametre lors de lappel de la classe

        // double boucle pour afficher les elements , les colonne dans les lignes et le nombre de ligne dont a besoin 

        for (let lgn = 0; lgn < this.lgn; lgn++) {
            const lgns = $('<div>').addClass('lgn');
            for (let col = 0; col < this.col; col++) {
                const cols = $('<div>').addClass('col empty').attr("data-col", col).attr("data-lgn", lgn) // oon stock la col et la lgn pour le reutiliser
                lgns.append(cols) // cree les div  des colonnes
            }
            jeu.append(lgns) // "" "" "" "" "" grilles
        }
    }
    ecoute = () => {
        const jeu = $(this.selector)
        const that = this // on le stock dans that pour pouvoir toujours utiliser nos fonctions
        // on cherche la derniere case libre
        const DerniereCase = (cols) => {
            const cellules = $(`.col[data-col='${cols}']`) // on sotck toute les celulles qui ont la meme classe     recupere le data de colonne (derniere case)
            for (let i = cellules.length - 1; i >= 0; i--) {
                const cellule = $(cellules[i]); // on stock la variable actuel vu qu'on parcours le tableau
                if (cellule.hasClass('empty')) { // si il a la classe vide alors on lui return cellules sinon null
                    return cellule

                }

            }
            return null
        }
        // animation souris dans la cellule (previsualisation)
        jeu.on('mouseenter', '.col.empty', function() { // fonction anonyme pour recuperer la colonne et dire que cette colonne c'est this et dans le data on recupere la colonne ou la souris es entré
            const col = $(this).data('col') // colonne c'est this (la ou on passe la souris et on recupere avec data)
            const derniere = DerniereCase(col)
            if (derniere != null) {
                // derniere.removeClass('empty')
                derniere.addClass(`p${that.player}`)
            }
        })
        // annimation quand on on retire la soouris de la cellule 
        jeu.on('mouseleave', '.col', function () { // fonction anonyme pour recuperer la colonne et dire que cette colonne c'est this et dans le data on recupere la colonne ou la souris es entré
            $('.col').removeClass(`p${that.player}`)
        })

        jeu.on('click', '.col.empty', function () {
            const col = $(this).data('col') // on recupere la colonne)
            const derniere = DerniereCase(col)
            derniere.addClass(`${that.player}`).removeClass(`empty p${that.player}`).data('player', `${that.player}`)// a chaque fois on supprime empty pour remplacer par le jeton rouge 
            
            const winner = that.gagnant(derniere.data('lgn'), derniere.data('col'))
            // that.player = (that.player === 'red') ? 'yellow' : 'red'

            // la condition qui va permettre le switch entre le jeton jaune et rouge (si le player es rouge alors tu me met jaune sinon tu me  met rouge)
            if (that.player === 'red') {
                that.player = 'yellow'
            } else {
                that.player = 'red'
            }

            if (winner) {
                alert(`${winner} a gg`)
                $('#rejouez').css('visibility', 'visible')
            }

        })

    }

    gagnant = (lgn, col) => {
        const that = this

        function getcell(i, j) {
            return $(`.col[data-lgn='${i}'][data-col='${j}']`) // on recupere la celulle html 
        }

        const checkdirection = (direction) =>{  // verifie les direction dans le tableau
            let total = 0
            let i = lgn + direction.i
            let j = col + direction.j
            let next = getcell(i, j)
            while (i >= 0 && i < that.lgn && j < that.col && next.data('player') === that.player) { // tant que i est inferieur ou egal a 0 ET i es plus petit que ligne ET j es plus petit que colonne et on verifie que le prochaine case es bien le data player qui sera = that.player( que le pion appartienne bien au meme joueur )
                total++ // incremente pour lui dire qu'on a deux jeton de la meme couleur
                i += direction.i
                j += direction.j
                next = getcell(i, j)
            }
            return total
        }

            

        const gagnant = (dirA, dirB) => { // verifie le gagnant si le total et de 4jeton alors tu me return le joueur sinn null
            const total = 1 + checkdirection(dirA) + checkdirection(dirB)
            if (total >= 4) {
                return that.player
            } else {
                return null
            }
        }
        // verifie l'horizontal et la vertical pour determiner le winner
        const horizontal = () => {
            return gagnant({ i: 0, j: -1 }, { i: 0, j: 1 })
        }
        const vertical = () => {
            return gagnant({ i: -1, j: 0 }, { j: 0, i: 1 })
        }

        const diagonal1 = () => {
            return gagnant({ i: 1, j: 1 }, { j: -1, i: -1 })
        }

        const diagonal2 = () => {
            return gagnant({ i: 1, j: -1 }, { j: 1, i: -1 })
        }

        return horizontal() || vertical() || diagonal1() || diagonal2()
    }
}

