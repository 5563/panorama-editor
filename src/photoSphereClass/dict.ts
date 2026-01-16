
export interface StyleEnum {
    [key: string]: {
        html: string,
        label: string,
        value: string
    },
    
}
export const styleEnum = (text?: string): StyleEnum => {
    return {
        style1: {
            html: `<div class=\"hotspot-with-arrow\"><div class=\"hotspot-text\">${text}</div><div class=\"arrow-down\"></div></div>`,
            label: '样式1',
            value: 'style1'
        },
        style2: {
            html: `<div class=\"hotspot\">${text}</div>`,
            label: '样式2',
            value: 'style2'
        }
    }as const;
} 

export const editStatusEnum  = {
    edit: 'edit',
    add: 'add',
    blank: 'blank'
}