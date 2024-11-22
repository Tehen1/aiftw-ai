import nodeFetch from 'node-fetch';
const fetch = nodeFetch;

const CLOUDFLARE_API_TOKEN = '1EuJLmnNJICZ9w92Pdpcap5BsL4DW6tsWt--iT8R';
const ZONE_ID = '676b636dee60bde19fb4aba934496eaf';
const SERVER_IP = '31.220.77.121';

const API_BASE = 'https://api.cloudflare.com/client/v4';

interface CloudflareResponse<T> {
    success: boolean;
    errors: any[];
    result: T;
}

interface DNSRecord {
    id: string;
    type: string;
    name: string;
    content: string;
}

async function makeCloudflareRequest<T>(endpoint: string, method: string, body?: any): Promise<T> {
    const response = await fetch(`${API_BASE}${endpoint}`, {
        method,
        headers: {
            'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
            'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json() as CloudflareResponse<T>;
    if (!data.success) {
        throw new Error(`Cloudflare API error: ${JSON.stringify(data.errors)}`);
    }
    return data.result;
}

async function listDNSRecords(): Promise<DNSRecord[]> {
    return makeCloudflareRequest<DNSRecord[]>(`/zones/${ZONE_ID}/dns_records`, 'GET');
}

async function deleteDNSRecord(recordId: string): Promise<void> {
    await makeCloudflareRequest<void>(`/zones/${ZONE_ID}/dns_records/${recordId}`, 'DELETE');
}

async function createDNSRecord(type: string, name: string, content: string, proxied: boolean = true): Promise<DNSRecord> {
    return makeCloudflareRequest<DNSRecord>(`/zones/${ZONE_ID}/dns_records`, 'POST', {
        type,
        name,
        content,
        proxied,
        ttl: 1, // Auto TTL
    });
}

async function updateDNSConfiguration() {
    try {
        console.log('Fetching current DNS records...');
        const records = await listDNSRecords();
        
        // Delete existing A, AAAA, and CNAME records
        for (const record of records) {
            if (record.type === 'A' || record.type === 'AAAA' || record.type === 'CNAME') {
                console.log(`Deleting ${record.type} record for ${record.name}...`);
                await deleteDNSRecord(record.id);
            }
        }

        // Create new A records for root and www
        console.log('Creating new A record for root domain...');
        await createDNSRecord('A', 'aiftw.be', SERVER_IP);
        
        console.log('Creating new A record for www subdomain...');
        await createDNSRecord('A', 'www.aiftw.be', SERVER_IP);

        console.log('DNS configuration updated successfully!');
        
        // Print new configuration
        const newRecords = await listDNSRecords();
        console.log('\nCurrent DNS Configuration:');
        newRecords.forEach((record) => {
            console.log(`${record.type} record: ${record.name} -> ${record.content}`);
        });

    } catch (error) {
        console.error('Error updating DNS configuration:', error);
        process.exit(1);
    }
}

// Run the update
updateDNSConfiguration();
