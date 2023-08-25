public with sharing class AssignmentsList {
    
    public static List<Assignment__c> getAssignmentList(){

        try{
            List<Assignment__c> result = [SELECT Title__c, Description__c, DueDate__c, Status__c FROM Assignment__c ORDER BY DueDate__c];

            return result;
        }
        catch(Exception e){
            return null;
        }
    }
}