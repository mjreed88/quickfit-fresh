#!/usr/bin/env python3
"""Test using Nova Act with Bedrock AgentCore"""
from nova_act import NovaAct, Workflow

def test_nova_act():
    """Test nova-act with Bedrock AgentCore browser"""

    # Create Nova Act agent
    agent = NovaAct(
        model_id="nova.realtime",
        use_bedrock=True,
        bedrock_region="us-east-1"
    )

    print("Testing quickfit.tech with Nova Act agent...")
    result = agent.run("Navigate to https://quickfit.tech and describe what you see on the page.")

    print(f"\nResult: {result}")
    return True

if __name__ == "__main__":
    try:
        test_nova_act()
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
