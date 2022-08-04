require ('dotenv').config();
const { SlashCommandBuilder } = require('discord.js');
const compute = require('@google-cloud/compute');
const projectId = process.env.PROJECT_ID;
const zone = process.env.ZONE;
const instanceName = process.env.INSTANCE_NAME;



module.exports = {
	data: new SlashCommandBuilder()
		.setName('start')
		.setDescription('マイクラのサーバーが起動します'),
	async execute(interaction) {
		await interaction.reply('サーバー起動中\nしばらくお待ち下さい(1～2分程度)');

        async function startInstance() {
            const instancesClient = new compute.InstancesClient();
            
            const [response] = await instancesClient.start({
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

            console.log('インスタンスが起動しました');
        }
            
        startInstance();
        // [END compute_start_instance]
	},
};