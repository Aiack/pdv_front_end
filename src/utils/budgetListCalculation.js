import parsers from '../utils/parsers'

const ifEmptyReturnZero = (text) => {
    num = parseFloat(text)
    if(num){
        return num
    }
    else{
        return 0
    }
}

const recalculateBudgetList = (list, changeBy) => {
    PRECOTABELA = ifEmptyReturnZero(list.PRECOTABELA)
    VALORUNITARIO = ifEmptyReturnZero(list.VALORUNITARIO)
    VALORTOTAL = ifEmptyReturnZero(list.VALORTOTAL)
    QUANTIDADE = ifEmptyReturnZero(list.QUANTIDADE)
    VALORDESCONTOITEM = ifEmptyReturnZero(list.VALORDESCONTOITEM)
    ALIQDESCONTOITEM = ifEmptyReturnZero(list.ALIQDESCONTOITEM)
    VALORACRESCIMOITEM = ifEmptyReturnZero(list.VALORACRESCIMOITEM)
    ALIQACRESCIMOITEM = ifEmptyReturnZero(list.ALIQACRESCIMOITEM)
    DESCMAXIMO = ifEmptyReturnZero(parsers.parseDiscountMax(list.DESCMAXIMO))

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

    switch (changeBy) {
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
            if(!QUANTIDADE){
                QUANTIDADE = 1
            }
            VALORACRESCIMOITEM = PRECOTABELA * (ALIQACRESCIMOITEM / 100) * QUANTIDADE
            VALORDESCONTOITEM = (VALORDESCONTOITEM / QUANTIDADE) * QUANTIDADE
            VALORDESCONTOITEM = PRECOTABELA * (ALIQDESCONTOITEM / 100) * QUANTIDADE
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
                ALIQDESCONTOITEM = discount_aliquo
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
            VALORTOTAL = VALORUNITARIO * QUANTIDADE
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
    DESCMAXIMO = DESCMAXIMO.toFixed(0)

    return (list = {
        PRECOTABELA,
        VALORUNITARIO,
        VALORTOTAL,
        QUANTIDADE,
        VALORDESCONTOITEM,
        ALIQDESCONTOITEM,
        VALORACRESCIMOITEM,
        ALIQACRESCIMOITEM,
        DESCMAXIMO
    })
}

const roundValues = (list, remove) => {
    console.log(remove)
    console.log(list)
}

export default { recalculateBudgetList, roundValues }