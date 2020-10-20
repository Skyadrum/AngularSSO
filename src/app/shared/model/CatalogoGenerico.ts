export interface ElementoCatalogo {
    id: number;
    nombre: string;
    descripcion: string;
}

export interface OpcionSelect {
    name: string;
    value: string;
}

export interface OpcionSelectAtributoExtra extends OpcionSelect {
    atributo: string;
}

// Creado especialmente para marcar cuales catalogos tendran su id editable
export interface OpcionSelectIdEditable extends OpcionSelect {
    idEditable: boolean;
}
