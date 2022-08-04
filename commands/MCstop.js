require ('dotenv').config();
const { SlashCommandBuilder } = require('discord.js');
const compute = require('@google-cloud/compute');
const projectId = process.env.PROJECT_ID;
const zone = process.env.ZONE;
const instanceName = process.env.INSTANCE_NAME;



module.exports = {
	data: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('マイクラのサーバーが停止します'),
	async execute(interaction) {
		await interaction.reply('サーバー停止中');

        async function stopInstance() {
            const instancesClient = new compute.InstancesClient();
        
            const [response] = await instancesClient.stop({
                project: projectId,
                zone,
                instance: instanceName,
            });
            let operation = response.latestResponse;
            const operationsClient = new compute.ZoneOperationsClient();
        
            // Wait for the operation to complete.
            while (operation.status !== 'DONE') {
                [operation] = await operationsClient.wait({
                operation: operation.name,
                project: projectId,
                zone: operation.zone.split('/').pop(),
                });
            }
            
            console.log('インスタンスが停止しました');
        }
        
        stopInstance();
        // [END compute_stop_instance]
	},
};