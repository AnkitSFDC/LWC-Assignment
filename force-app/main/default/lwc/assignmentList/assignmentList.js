/**
 *  Created By: Ankit Palahania
 *  Date: 25th Aug, 2023
 *  ASSIGMENT: Create a lightning data
 * 
 */

import { LightningElement, track, wire, api } from 'lwc';
import AssignList from '@salesforce/apex/AssignmentsList.getAssignmentList';
export default class AssignmentList extends LightningElement {

    // SETTING COLUMNS FOR TABLE
    @api columns = [{
        label: 'Title',
        fieldName: 'Title__c',
        type: 'text',

    },
    {
        label: 'Description',
        fieldName: 'Description',
        type: 'TextArea',

    },
    {
        label: 'Due Date',
        fieldName: 'DueDate__c',
        type: 'Date',

    },
    {
        label: 'Status',
        fieldName: 'Status__c',
        type: 'Picklist',

    }

    ];



    // PROPERTIES TO STORE THE LIST AND RESULT
    @api assignRecList;           // LIST OF ASSIGNMENT IN DATATABLE
    @track error;           // ERROR: FROM APEX CALL
    @track searchString;    // INPUT WE GIVE IN SEARCH
    @track initialRecords;

    @track value;
    @track error;
    @track data;
    @api sortedDirection = 'asc';
    @api sortedBy = 'Name';
    @api searchKey = '';
    result;
    @track allSelectedRows = [];
    @track page = 1;
    @track items = [];
    @track data = [];

    @track startingRecord = 1;
    @track endingRecord = 0;
    @track pageSize = 5;
    @track totalRecountCount = 0;
    @track totalPage = 0;
    isPageChanged = false;
    initialLoad = true;
    mapoppNameVsOpp = new Map();;



    // USING WIRE TO CALL APEX METHOD
    @wire(AssignList) listOfRecords({ data, error }) {
        // IF WE GET THE DATA FROM THE APEX
        if (data) {
            this.assignRecList = data;
            this.initialRecords = data;
            this.processRecords(data);

        }
        // IF WE GET THE ERROR 
        else if (error) {
            this.error = error;
        }
    }

    // ON SEARCH : SHOW THE RESPECTIVE ROW OF THE TABLE 
    handleSearch(event) {
        // FOR CASE INSENSITVE SEARCH
        // CONVERTING EVERY input into one type of case(lower case)
        const searchKey = event.target.value.toLowerCase();

        // IF SEARCH KEY(INPUT) IS PRESENT
        if (searchKey) {
            // UPDATE THE assignRecList (TABLE LIST) WITH ININTAL RECORDS
            this.assignRecList = this.initialRecords; // FOR STORING INITIAL LIST BACK TO assignRecList

            if (this.assignRecList) {

                let searchRecords = [];  // FOR SHOWING THE MATCHING RECORDS

                for (let record of this.assignRecList) {

                    let valuesArray = Object.values(record);     // CURRENT INDEX ITEM FIELD VALUES

                    // ITERATING IN FIELD VALUES OF CURRENT ARRAY ITEM
                    for (let val of valuesArray) {
                        console.log('VAL: ', val)
                        let strVal = String(val);   // EXPLICIT CONVERSION TO STRING FOR STRING CHECK (INCLUDES)

                        if (strVal) {

                            // IF SEARCHKEY IS PRESENT IN CURRENT RECORD , PUSH THE RECORD IN SEARCHRECORDS
                            if (strVal.toLowerCase().includes(searchKey)) {
                                searchRecords.push(record);
                                break;
                            }
                        }
                    }
                }

                this.assignRecList = searchRecords;
            }
        } else {
            this.assignRecList = this.initialRecords;
        }
    }


    // PROCESS RECORDS FOR PAGINATION
    processRecords(data) {
        this.items = data;
        this.totalRecountCount = data.length;
        this.totalPage = Math.ceil(this.totalRecountCount / this.pageSize);

        this.assignRecList = this.items.slice(0, this.pageSize);
        this.endingRecord = this.pageSize;

    }

    // ON CLICK OF PREVIOUS BUTTON THIS WILL BE CALLED
    previousHandler() {
        this.isPageChanged = true;
        if (this.page > 1) {
            this.page = this.page - 1; //decrease page by 1
            this.displayRecordPerPage(this.page);
        }
        var selectedIds = [];
        for (var i = 0; i < this.allSelectedRows.length; i++) {
            selectedIds.push(this.allSelectedRows[i].Id);
        }
        this.template.querySelector(
            '[data-id="table"]'
        ).selectedRows = selectedIds;

        console.log('========== PREVIOUS HANDLER=============')
    }

    // ON CLICK OF NEXT BUTTON THIS METHOD WILL BE CALLED
    nextHandler() {
        this.isPageChanged = true;
        if ((this.page < this.totalPage) && this.page !== this.totalPage) {
            this.page = this.page + 1; //increase page by 1
            this.displayRecordPerPage(this.page);
        }
        var selectedIds = [];
        for (var i = 0; i < this.allSelectedRows.length; i++) {
            selectedIds.push(this.allSelectedRows[i].Id);
        }
        this.template.querySelector(
            '[data-id="table"]'
        ).selectedRows = selectedIds;
        console.log('========== NEXT HANDLER=============')

    }


    // FOR SHOWING RECORD AS PER PAGE (WHEN NAVIGATION HAPPENS)
    displayRecordPerPage(page) {

        this.startingRecord = ((page - 1) * this.pageSize);
        this.endingRecord = (this.pageSize * page);

        this.endingRecord = (this.endingRecord > this.totalRecountCount)
            ? this.totalRecountCount : this.endingRecord;

        this.assignRecList = this.items.slice(this.startingRecord, this.endingRecord);
        this.startingRecord = this.startingRecord + 1;
    }



}