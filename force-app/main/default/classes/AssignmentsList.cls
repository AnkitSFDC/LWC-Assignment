public with sharing class AssignmentsList {
    @AuraEnabled(cacheable=true)
    public static List<Assignment__c> getAssignmentList(){

        try{
            List<Assignment__c> result = [SELECT Title__c, Description__c, DueDate__c, Status__c FROM Assignment__c ORDER BY DueDate__c];

            return result;
        }
        catch(Exception e){
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static List<Assignment__c> insertAssignment(String title,String description, Date currentdate, String status){
        try {
            List<Assignment__c> newAssignList = new List<Assignment__c>();

            if(String.isNotBlank(title)){
                Assignment__c obj = new Assignment__c();
                obj.Title__c = title;
                obj.Description__c = description;
                obj.DueDate__c = currentdate;
                obj.Status__c = status;

                newAssignList.add(obj);
            }

            if(!newAssignList.isEmpty()){
                insert newAssignList;
            }
            
            return newAssignList;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static List<Assignment__c> updateAssignment(String Id,String title,String description, Date currentdate, String status){
        try {
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }


}