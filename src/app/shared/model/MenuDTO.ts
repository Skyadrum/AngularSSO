export interface MenuDTO {
    id: string;
    id_pantalla: number;
    controller: string;
    label: string;
    routerLink: string;
    items: MenuDTO[];
}