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


}