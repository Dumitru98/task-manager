# task-manager

This is the README for a application to manage tasks in a team working on a project.

TODO: 
	UI (ce are - si * inseamna ca il pot face si eu si tu, ce are doar - poti face doar tu):
	!!!!!!! DE RESPECTAT CE CODNIG STYLE AU ACUM FISIERELE .VUE IN PULA LUI CALIN SI A LUI MARIUS
		- * data sa fie frumos prezentata
		- * text de scris pentru partea de settings
		- * check pe lungime maxima de fullName/groupName/username etc 20 caractere
		- * taskStatus = Deleted daca userCreator a sters task-ul
		- * sa nu se straga task-ul daca il sterge taskCreatorul, ci doar din lista proprie. Cel care il va sterge ultimul din baza de date este ultimul user din lista de usersReceiver

	SERVER:
		- Implement token and tasksModified variables checking with redis
		- To see how you can reassign a task from a user who exit the group
		- To see how you can reassign if all the users denied a task
		- Make the logout if logout fail or other things like this

	CSS:
		- sa nu mai apara niciunde acel highlight albastru din jurul atributului pe care il apesi cu mouse-ul (exemplu, input din login)
		- schimbat fontul din tot site-ul
		- in tabelul mare, cu tasksGiven si tasksReceived, task-urile sa nu mai apara centrate pe inaltime (daca nu intelegi, intreba-ma pe mine sau pe many)
		- lista cu userii sa se afle in partea dreapta a ecranului, si sa nu fie fie foarte mari (vezi facebook)
		- butonul de logout sa se afle in partea din dreapta a dashboard-ului, alaturi de acel mesaj cu hello, username-ul si fullName-ul
		- sa nu mai apara propunerile de la google chrome pentru input-uri

	IDEAS:
		1. Have sticky notes per task
		2. Send mails when approaching the deadline, when task deleted or when a user dropped a task by exiting the group
		3. Application on android for buzzers instead of e-mails (but still, keep the e-mails)
		4. Messages per task (like a mini watsapp)
		5. Cache for tasks per groupName
		6. To be able to upload a file, as well as download it

		OPTIONAL: UML diagram
