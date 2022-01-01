export class metaType {
    expire_time: number;
    expire_timestamp: number;
    repo_capacity: number;
    type: number;
}

export class datumType {
    create_time: number;
    face_number: number;
    id: number;
    local: boolean;
    meta: metaType;
    name: string;
    summary: string;
    sync: number;
    update_time: number;
}

export class masterType {
    code: number;
    msg: string;
    data: datumType[];
}


export class datumSkin {
    _id: string;
    id: number;
    name: string;
}

export class masterSkin {
    code: number;
    msg: string;
    data: datumSkin[];
}

export class datumHair {
    _id: string;
    id: number;
    description: string;
    name: string;
}

export class masterHair {
    code: number;
    msg: string;
    data: datumHair[];
}

export interface datumItem {
    _id: string;
    id: number;
    name: string;
}

export interface masterItem {
    code: number;
    msg: string;
    data: datumItem[];
}