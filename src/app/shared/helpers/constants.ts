import { faClipboard, faCog, faComment, faUser } from '@fortawesome/free-solid-svg-icons';
import { IMessageRoute, IAlerta, ILeftNavMenu } from '@shared/models/common/interfaces';

export const MIN_CHARACTERS_SEARCH = 3;

export const BASE_DATE_FORMAT = 'DD/MM/YYYY';

export const TIMER_REQUEST = 50000;

export const PATH_IP_SERVICE = 'https://api.ipify.org/?format=json';

export const PATH_SERVICE: Array<string> = [
    'lista/comun',

    'programa/filtro',
    'programa',
    'programa/{idPrograma}',
    'programa/{idPrograma}/cobertura',
    'programa/{idPrograma}/diagnostico',
    'programa/{idPrograma}/documento/{idDocumento}/{usuario}/{ip}/{modulo}/{accion}',//6
    'programa/{idPrograma}/pdf/{usuario}/{ip}/{modulo}/{accion}',//7
    'programa/{idPrograma}/clona',
    'programa/{idPrograma}/activo',
    'programa/{idPrograma}/inactivo',
    'programa/{idPrograma}/documento/',
    'filtra/cobertura/cliente',

    'asegurado/lista/comun',
    'asegurado/lista/excel/{usuario}/{ip}/{modulo}/{accion}',//14
    'asegurado/{idCia}/{idAsegurado}/{tipoDocumento}/{numeroDocumento}/',
    'asegurado/{idCia}/{idAsegurado}/{tipoDocumento}/{numeroDocumento}/pdf/{usuario}/{ip}/{modulo}/{accion}',//16
    'asegurado/{idCia}/{idAsegurado}/{tipoDocumento}/{numeroDocumento}/IMC/',
    'asegurado/{idCia}/{idAsegurado}/{tipoDocumento}/{numeroDocumento}/afiliar/',
    'asegurado/{idCia}/{idAsegurado}/{tipoDocumento}/{numeroDocumento}/excluir/',
    'asegurado/{idCia}/{idAsegurado}/{tipoDocumento}/{numeroDocumento}/listaProgramas',
    'asegurado/afiliar/masivo',
    'asegurado/excluir/masivo',

    'solicitud/filtro',
    'solicitud/',
    'solicitud/{idSolicitud}/',
    'solicitud/{idSolicitud}/documento',
    'solicitud/{idSolicitud}/documento/{idDocumento}/{usuario}/{ip}/{modulo}/{accion}',//27
    'solicitud/{idSolicitud}/anular',
    'solicitud/{idSolicitud}/aprobar',
    'solicitud/{idSolicitud}/rechazar',
    'solicitud/{idSolicitud}/pedido',
    'lista/afiliado',
    'lista/siteds',
    'lista/cobertura',

    'programa/{idPrograma}/nombre/{nombrePrograma}',
    'asegurado/generarSugeridos',
    'rol'//37
];

export const PATH_URL_DATA: Array<string> = [
    '',
    'programas',
    'nuevo-programa',
    'detalle-programa/:programId',
    'detalle-programa',

    'asegurados',
    'detalle-asegurado/:insuredId',
    'detalle-asegurado',
    'nueva-inscripcion',
    'nueva-exclusion',
    
    'solicitudes-medicas',
    'nueva-solicitud-medica',
    'detalle-solicitud-medica/:requestId',
    'detalle-solicitud-medica',
    'receta-larga',
    'detalle-pedido-receta/:requestId',
    'detalle-pedido-receta',
    
    'mensaje',

    'error',

    '**',
];

export const MESSAGE_ROUTE: Array<IMessageRoute> = [
    {
        path: 'mensaje',
        data: {
            title: 'Título de mensaje',
            message: 'Texto de mensaje'
        }
    },
];

export const ERROR_ROUTE: Array<IMessageRoute> = [
    {
        path: 'error',
        data: {
            title: 'Error',
            message: 'Ocurrió un problema interno de la aplicación'
        }
    }
];

export const ALERT_MESSAGES : Array<IAlerta> = [
    {
        title: 'Aviso',
        message: 'No se encontraron resultados para la búsqueda',
        type: 1
    },
    {
        title: '',
        message: '',
        type: 2
    },
    {
        title: 'Error',
        message: 'Hubo un error en su consulta, inténtelo nuevamente.',
        type: 3
    },
    {
        title: 'Éxito',
        message: 'La operación se ha realizado con éxito',
        type: 4
    },
    {
        title: 'Error',
        message: 'Error al acceder a TE CUIDAMOS.',
        type: 5
    },
];

export enum ALERT_TYPE {
    search = 1,
    custom = 2,
    error = 3,
    success = 4
};

export const CONTENT_TYPE: any = {
    excel : "application/vnd.ms-excel",
    excel_new: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    pdf : "application/pdf",
    jpg : "image/jpeg",
    jpeg : "image/jpeg",
    png : "image/png",
    txt: "text/plain",
    zip : "application/zip",
    word: "application/msword", 
    word_new: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", 
};

export const EXTENSION_FILES: any = {
    excel : ".xls",
    excel_new: ".xlsx",
    pdf : ".pdf",
    jpg : ".jpg",
    jpeg : ".jpeg",
    png : ".png",
    txt: "txt",
    zip : ".zip",
    word: "doc",
    word_new: "docx"
};

export const LEFT_NAV_MENUS: ILeftNavMenu[] = [ 
    {
        title: 'Mi Cuenta',
        links: [
            {
                icon: faUser,
                name: 'Perfil'
            },
            {
                icon: faCog,
                name: 'Mi cuenta'
            },
            {
                icon: faClipboard,
                name: 'Historial'
            },
            {
                icon: faComment,
                name: 'Comentarios'
            }
        ]
    }
];

