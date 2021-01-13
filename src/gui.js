class GUI{
    static create(a_name, a_type, a_class, a_parent){
        let element = document.createElement(a_type);
        element.id = a_name;
        element.className = a_class;
        document.getElementById(a_parent).appendChild(element);
        return element;
    }

    static remove(a_name){
        document.getElementById(a_name).remove();
    }

    static get(a_name){
        return document.getElementById(a_name);
    }
}