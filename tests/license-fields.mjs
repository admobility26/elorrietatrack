import assert from 'node:assert/strict';import {NO_EXPIRY,parseLicenseDate,licenseExpiryLabel} from '../src/licenseFields.js';import {filterLicenses} from '../src/licenseReport.js';
assert.equal(parseLicenseDate('00-00-0000'),NO_EXPIRY);assert.equal(licenseExpiryLabel({expires_at:NO_EXPIRY}),'Sin caducidad');
for(const invalid of ['31-02-2028','29-02-2027','00-01-2028','01-13-2028','1-1-2028','abc'])assert.throws(()=>parseLicenseDate(invalid));
assert.equal(new Date(parseLicenseDate('29-02-2028')).getDate(),29);
const row={id:'1',label:'Centro',pc_identifier:'Aula 8 PC 03',active:1,expires_at:NO_EXPIRY};assert.equal(filterLicenses([row],'all','pc 03').length,1);
console.log('PASS: strict date validation, zero date means perpetual, leap years, expiry label and PC search.');
