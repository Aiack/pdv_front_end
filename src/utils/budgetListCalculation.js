export default recalculateBudgetList = (list, recalculateBy) => {
    PRECOTABELA = parseFloat(list.PRECOTABELA)
    VALORUNITARIO = parseFloat(list.VALORUNITARIO)
    VALORTOTAL = parseFloat(list.VALORTOTAL)
    QUANTIDADE = parseFloat(list.QUANTIDADE)
    VALORDESCONTOITEM = parseFloat(list.VALORDESCONTOITEM)
    ALIQDESCONTOITEM = parseFloat(list.ALIQDESCONTOITEM)
    VALORACRESCIMOITEM = parseFloat(list.VALORACRESCIMOITEM)
    ALIQACRESCIMOITEM = parseFloat(list.ALIQACRESCIMOITEM)
    DESCMAXIMO = parseFloat(list.DESCMAXIMO)

    const updateDescAcres = (aliquote) => {
        if(aliquote > 1){
            VALORDESCONTOITEM = 0
            ALIQDESCONTOITEM = 0
            acresAliq = (aliquote - 1) * 100
            ALIQACRESCIMOITEM = acresAliq
            VALORACRESCIMOITEM = (acresAliq / 100) * PRECOTABELA * QUANTIDADE
        }
        else{
            ALIQACRESCIMOITEM = 0
            VALORACRESCIMOITEM = 0
            if(exceedMaxDiscount(aliquote)){
                discAliq = DESCMAXIMO
            }
            else{
                discAliq = (1 - aliquote) * 100
            }
            ALIQDESCONTOITEM = discAliq
            VALORDESCONTOITEM = (discAliq / 100) * PRECOTABELA * QUANTIDADE
        }
    }

    const exceedMaxDiscount = (aliquote) => {
        if(aliquote < 1 && (1 - aliquote) > (DESCMAXIMO / 100)){
            return true
        }
        return false
    }

    switch (recalculateBy) {
        case 'itemPrice':
            aliquote = VALORUNITARIO / PRECOTABELA
            if(exceedMaxDiscount(aliquote)){
                VALORUNITARIO = PRECOTABELA * (1 - (DESCMAXIMO / 100))
                aliquote = VALORUNITARIO / PRECOTABELA
            }
            VALORTOTAL = VALORUNITARIO * QUANTIDADE
            updateDescAcres(aliquote)
            break

        case 'totalPrice':
            VALORUNITARIO = VALORTOTAL / QUANTIDADE
            aliquote = VALORUNITARIO / PRECOTABELA
            if(exceedMaxDiscount(aliquote)){
                VALORUNITARIO = PRECOTABELA * (1 - (DESCMAXIMO / 100))
                aliquote = VALORUNITARIO / PRECOTABELA
                VALORTOTAL = VALORUNITARIO * QUANTIDADE
            }
            updateDescAcres(aliquote)
            break

        case 'quantity':
            aliquote = VALORUNITARIO / PRECOTABELA
            updateDescAcres(aliquote)
            VALORTOTAL = VALORUNITARIO * QUANTIDADE
            break

        case 'discountValue':
            discountPerItem = VALORDESCONTOITEM / QUANTIDADE
            VALORUNITARIO = PRECOTABELA - discountPerItem
            aliquote = VALORUNITARIO / PRECOTABELA
            if(exceedMaxDiscount(aliquote)){
                VALORUNITARIO = PRECOTABELA * (1 - (DESCMAXIMO / 100))
                discountPerItem = PRECOTABELA - VALORUNITARIO
                VALORDESCONTOITEM = discountPerItem * QUANTIDADE
            }
            ALIQDESCONTOITEM = ((discountPerItem)/PRECOTABELA) * 100
            VALORUNITARIO += (VALORACRESCIMOITEM / QUANTIDADE)
            VALORTOTAL = VALORUNITARIO * QUANTIDADE
            break

        case 'discountAliquo':
            discount_aliquo = ALIQDESCONTOITEM
            if(discount_aliquo > DESCMAXIMO){
                discount_aliquo = DESCMAXIMO
                ALIQDESCONTOITEM = discount_aliquo * 100
            }
            VALORUNITARIO = PRECOTABELA * ( 1 - (ALIQDESCONTOITEM / 100))
            VALORDESCONTOITEM = (PRECOTABELA - VALORUNITARIO) * QUANTIDADE
            VALORUNITARIO += (VALORACRESCIMOITEM / QUANTIDADE)
            VALORTOTAL = VALORUNITARIO * QUANTIDADE
            break
        
        case 'acrescValue':
            acresPerItem = VALORACRESCIMOITEM / QUANTIDADE
            VALORUNITARIO = PRECOTABELA + acresPerItem
            ALIQACRESCIMOITEM = ((acresPerItem)/ PRECOTABELA) * 100
            VALORUNITARIO -= (VALORDESCONTOITEM / QUANTIDADE)
            break
        
        case 'acrescAliquo':
            VALORUNITARIO = PRECOTABELA * ( 1 + (ALIQACRESCIMOITEM / 100))
            VALORACRESCIMOITEM = (VALORUNITARIO - PRECOTABELA) * QUANTIDADE
            VALORUNITARIO -= (VALORDESCONTOITEM / QUANTIDADE)
            VALORTOTAL = VALORUNITARIO * QUANTIDADE
            break

        default:
            break
    }

    PRECOTABELA = PRECOTABELA.toFixed(2)
    VALORUNITARIO = VALORUNITARIO.toFixed(2)
    VALORTOTAL = VALORTOTAL.toFixed(2)
    QUANTIDADE = QUANTIDADE.toFixed(1)
    VALORDESCONTOITEM = VALORDESCONTOITEM.toFixed(2)
    ALIQDESCONTOITEM = ALIQDESCONTOITEM.toFixed(2)
    VALORACRESCIMOITEM = VALORACRESCIMOITEM.toFixed(2)
    ALIQACRESCIMOITEM = ALIQACRESCIMOITEM.toFixed(2)
    DESCMAXIMO = DESCMAXIMO.toFixed(2)

    return {
        PRECOTABELA,
        VALORUNITARIO,
        VALORTOTAL,
        QUANTIDADE,
        VALORDESCONTOITEM,
        ALIQDESCONTOITEM,
        VALORACRESCIMOITEM,
        ALIQACRESCIMOITEM,
        DESCMAXIMO
    }

}