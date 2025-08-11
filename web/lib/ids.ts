import { customAlphabet } from 'nanoid';
const nano = customAlphabet('ABCDEFGHJKLMNPQRSTUVWXYZ23456789', 8);
export function newLeadId(){ return `L-${nano()}`; }
export function newJoinCode(){ return nano(); }
