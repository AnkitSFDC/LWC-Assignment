import { LightningElement, track, api } from 'lwc';
import insertAssignment from '@salesforce/apex/AssignmentsList.insertAssignment';
import updateAssignment from '@salesforce/apex/AssignmentsList.updateAssignment';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class AssignmentForm extends LightningElement {
    @api recordId

    // FOR DISABLING/ENABLING THE BUTTON
    @track isDisabled = true

    // FOR TITLE,DESCRIPTION AND DATE
    @track titleValue
    @track descriptionValue
    @track dateValue

    // FOR COMBOBOX
    @track statusvalue = 'Not Started';
    @track placeHolderValue

    // FOR RESULT AND ERROR HANDLING
    @track insertResult
    @track insertError

    @track insertedTitle
    @track insertedId

    // COMBOBOX OPTIONS
    get options() {
        return [
            { label: 'Not Started', value: 'Not Started' },
            { label: 'In Progress', value: 'In Progress' },
            { label: 'Completed', value: 'Completed' },
        ];
    }

    // HANDLE TITLE CHANGE & TITLE INPUT FIELD VALIDATION
    handleTitleChange(evt) {
        if (evt) {
            this.titleValue = evt.target.value;
            console.log('TITLE VALUE: ', this.titleValue)
            // DISABLE THE BUTTON IF TITLE IS NOT PRESENT
            this.isDisabled = this.titleValue.length > 0 ? this.isDisabled = false : this.isDisabled = true;

        }
    }

    // HANDLE DESCRIPTION CHANGE
    handleDescChange(evt) {
        if (evt) {
            this.descriptionValue = evt.target.value;
        }
    }

    // HANDLE DATE CHANGE
    handleDateChange(evt) {
        if (evt) {
            this.dateValue = new Date(evt.target.value);
        }
    }

    // COMBOBOX VALUE
    handleChange(event) {
        this.statusvalue = event.detail.value;
        this.placeHolderValue = this.statusvalue;
    }

    //FOR INSERTING THE RECORD
    handleSave(event) {

        // CALLING APEX TO INSERT THE ASSIGNMENT
        insertAssignment({ title: this.titleValue, description: this.descriptionValue, currentdate: this.dateValue, status: this.statusvalue }).then(
            result => {

                this.insertResult = result;

                // FOR STORING THE INSERTED TITLE AND ITS RESPECTIVE ID
                this.insertedTitle = result[0]['Title__c']
                this.insertedId = result[0]['Id'];
                console.log('RESULT: ', JSON.stringify(result))
                console.log('INSERTED TTILE AND NAME: ', this.insertedTitle, ' ', this.insertedId);
                // FOR TOAST
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Success',
                    message: 'Assignment Saved',
                    variant: 'success'
                }))

                //FOR DISPATCHING EVENT TO PARENT(FOR UPDATING ASSIGNMENT LIST)
                this.dispatchEvent(new CustomEvent('save', { detail: result }))

            }
        ).catch(error => {
            this.insertError = error

            this.dispatchEvent(new ShowToastEvent({
                title: 'Error Creating Record',
                message: error.body.message,
                variant: 'error'
            }))

        })
    }


    // FOR UPDATING THE RECORD
    handleEdit(evt) {

        // CALLING APEX TO INSERT THE ASSIGNMENT

        if (this.insertedTitle == this.titleValue) {

            updateAssignment({ Id: this.insertedId, title: this.titleValue, description: this.descriptionValue, currentdate: this.dateValue, status: this.statusvalue }).then(
                result => {

                    this.insertResult = result;

                    // FOR TOAST
                    this.dispatchEvent(new ShowToastEvent({
                        title: 'Success',
                        message: 'Assignment Saved',
                        variant: 'success'
                    }))

                    location.reload();

                }
            ).catch(error => {
                this.insertError = error

                this.dispatchEvent(new ShowToastEvent({
                    title: 'Error Creating Record',
                    message: error.body.message,
                    variant: 'error'
                }))

            })
        }
        else {
            this.isDisabled = !this.isDisabled
            this.dispatchEvent(new ShowToastEvent({
                title: 'Cannot Edit',
                message: 'We can edit only the same Title, for new Title please use SAVE option',
                variant: 'error'
            }))
        }
    }

}