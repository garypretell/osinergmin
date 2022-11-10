export interface IAlerta {
    title: string;
    message: string;
    type: number;
    close?: boolean;
    showIcon?: boolean;
    btnClose?: boolean;
    icon?:string | null;
}