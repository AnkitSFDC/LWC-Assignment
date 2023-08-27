/**
 *  Created By: Ankit Palahania
 *  Date: 25th Aug, 2023
 *  Component: Lightning Datatable with Search and Pagination
 *  Last Modified: 27th Aug, 2023
 */

import { LightningElement, track, wire, api } from 'lwc';
import AssignList from '@salesforce/apex/AssignmentsList.getAssignmentList';
export default class AssignmentList extends LightningElement {

    // SETTING COLUMNS FOR TABLE 
    // api : PROPERTIES ARE PUBLIC AND CAN BE ASSIGNED FROM PARENT COMPONENT IN FUTURE 
    @api columns = [{
        label: 'Title',
        fieldName: 'Title__c',
        type: 'text',

    },
    {
        label: 'Description',
        fieldName: 'Description__c',
        type: 'text',

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
    // api : PROPERTIES ARE PUBLIC AND CAN BE ASSIGNED FROM PARENT COMPONENT IN FUTURE
    @api assignRecList;     // LIST OF ASSIGNMENT IN DATATABLE
    @track error;           // ERROR: FROM APEX CALL
    @track searchString;    // INPUT WE GIVE IN SEARCH
    @track initialRecords;  // INITIAL RECORDS FOR SEARCHING

    // PROPERTIES FOR SEARCHING
    @track value;
    @track error;
    @track data;

    @api searchKey = '';

    // PROPPERTIES FOR PROCESSING AND PAGINATION
    @track allSelectedRows = [];
    @track page = 1;
    @track items = [];
    @track data = [];

    @track startingRecord = 1;
    @track endingRecord = 0;
    @track pageSize = 5;
    @track totalRecountCount = 0;
    @track totalPage = 0;
    @track isPageChanged = false;

    // PROPERTY FOR STORING THE REFRESHED LIST
    @track refreshListResult


    // USING WIRE TO CALL APEX METHOD
    @wire(AssignList) listOfRecords({ data, error }) {
        // IF WE GET THE DATA FROM THE APEX
        if (data) {
            // SETTING SUCCESS DATA FOR LIST
            this.assignRecList = data;
            this.initialRecords = data;
            this.refreshListResult = data;

            // FOR PROCESSING RECORDS FOR PAGINATION PER PAGE
            this.processRecords(data);

        }
        // IF WE GET THE ERROR 
        else if (error) {
            // SETTING ERROR
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
            // IF NO SEARCH KEY - DEFAULT LIST AND PROCESS BACK RECORDS TO DEFAULT
            this.assignRecList = this.initialRecords;
            this.processRecords(this.assignRecList);
        }
    }


    // PROCESS RECORDS FOR PAGINATION
    processRecords(data) {
        this.items = data;
        this.totalRecountCount = data.length;
        this.totalPage = Math.ceil(this.totalRecountCount / this.pageSize);

        // PROCESSED AND STORING RECORDS PER PAGE
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

        // PUSHING PREVIOUS SET OF RECORDS TO PREVIOUS PAGE
        for (var i = 0; i < this.allSelectedRows.length; i++) {
            selectedIds.push(this.allSelectedRows[i].Id);
        }

        // GET THE ELEMENT WHICH HAS DATA-ID=Table, i.e. DATATABLE
        this.template.querySelector(
            '[data-id="table"]'
        ).selectedRows = selectedIds;

    }

    // ON CLICK OF NEXT BUTTON THIS METHOD WILL BE CALLED
    nextHandler() {
        this.isPageChanged = true;
        if ((this.page < this.totalPage) && this.page !== this.totalPage) {
            this.page = this.page + 1; //increase page by 1
            this.displayRecordPerPage(this.page);
        }
        var selectedIds = [];

        // PUSHING NEXT SET OF RECORDS IN NEXT PAGE
        for (var i = 0; i < this.allSelectedRows.length; i++) {
            selectedIds.push(this.allSelectedRows[i].Id);
        }

        // GET THE ELEMENT WHICH HAS DATA-ID=Table, i.e. DATATABLE
        this.template.querySelector(
            '[data-id="table"]'
        ).selectedRows = selectedIds;


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


    // HANDLE CHILD ELEMENT SAVE 
    handleSaveRecord(evt) {
        if (evt) {

            // AFTER SAVE REFRESHING THE LIST FOR TABLE
            this.assignRecList = [...this.refreshListResult, evt.detail[0]];

            // AFTER SAVE REFRESHING THE LIST FOR SEARCHING AND PROCESSING
            this.initialRecords = [...this.refreshListResult, evt.detail[0]]

            // SINCE LIST IS UPDATED , AGAIN PROCESS THE RECORDS WITH UPDATED LIST
            this.processRecords(this.assignRecList)

        }
    }


}