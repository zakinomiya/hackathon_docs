class HelloWorld {
    init(){
        this._mapPut('country', 'japan', [])
    }

    can_update(data) {
        return blockchain.requireAuth(blockchain.contractOwner(), "active");
    }

    /**
     * @param {string} name 
     * @param {string} countryName 
     */
    hello(name, countryName){
        const countryList = this._mapGet('country', countryName)

        if(!countryList){
            //　その国の人が今までいなければ新しく配列をつくってストレージにしまう
            this._mapPut('country', countryName, [name])
        } else {
            //　2人目以降だったら配列に入れてしまう
            countryList.push(name)
            this._mapPut('country', countryName, countryList)
        }

        //　最後にこの関数を呼び出した人をしまう
        this._put('lastPerson', name)
        return `${countryName}の${name}さん、こんにちは`
    }

    // 最後に関数を呼び出した人を取得
    getLastPerson(){
        return this._get('lastPerson')
    }


    /**
     * 国ごとに関数を呼び出した人を取得
     * @param {string} country 
     */

    getHistoryByCountry(country){
        return this._mapGet('country', country)
    }

    _put(k,v){
        const value = JSON.stringify(v);
        storage.put(k, value);
    }

    _get(k){
        const v = storage.get(k);
        return JSON.parse(v);
    }

    _mapGet(k, f){
     const v = storage.mapGet(k, f);
     const value = JSON.parse(v);
     return value;   
    }

    _mapPut(k, f, v){
        const value = JSON.stringify(v);
        storage.mapPut(k, f, value);
    }

}

module.exports = HelloWorld