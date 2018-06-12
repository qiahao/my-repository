import { eachOwn } from "@/utils";
export default (data) => {
  let str = []
    for (let p in data) {
      let value = data[p]
      if(data.hasOwnProperty(p)){
        if(typeof data[p] == 'object'){
          value = JSON.stringify(data[p])
        }
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(value));    
      }
    }
    return str.join("&");
}